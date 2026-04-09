#!/usr/bin/env python3
"""
Generate EDIFACT release schema files for this project format.

Output files:
- src/schemas/edifact/<RELEASE>/<RELEASE>.json
- src/schemas/edifact/<RELEASE>/<RELEASE>_versions.json
"""

from __future__ import annotations

import argparse
import copy
import html as html_lib
import json
import re
import tempfile
import zipfile
from pathlib import Path
from typing import Any


RE_CHANGE_PREFIX = r"[+*#|X\-]?"


def read_lines(path: Path) -> list[str]:
  for enc in ("utf-8-sig", "cp1252", "latin-1"):
    try:
      return path.read_text(encoding=enc).splitlines()
    except UnicodeDecodeError:
      continue
  # fallback, keep deterministic behavior
  return path.read_text(encoding="latin-1").splitlines()


def normalize_spaces(text: str) -> str:
  return " ".join(text.split()).strip()


def parse_rep(repr_raw: str) -> tuple[str, int, int]:
  repr_raw = (repr_raw or "").strip()
  low = repr_raw.lower()

  m = re.match(r"^([a-z]+)\.\.(\d+)$", low)
  if m:
    return m.group(1).upper(), 0, int(m.group(2))

  m = re.match(r"^([a-z]+)(\d+)$", low)
  if m:
    ln = int(m.group(2))
    return m.group(1).upper(), ln, ln

  m = re.match(r"^([a-z]+)", low)
  return (m.group(1).upper() if m else ""), 0, 0


def read_text(path: Path) -> str:
  for enc in ("utf-8-sig", "cp1252", "latin-1"):
    try:
      return path.read_text(encoding=enc)
    except UnicodeDecodeError:
      continue
  return path.read_text(encoding="latin-1")


def strip_html_to_lines(path: Path) -> list[str]:
  text = read_text(path)
  text = re.sub(r"(?is)<script\b.*?</script>", "", text)
  text = re.sub(r"(?is)<style\b.*?</style>", "", text)
  text = re.sub(r"(?i)<br\s*/?>", "\n", text)
  text = re.sub(r"(?i)</p>", "\n", text)
  text = re.sub(r"(?i)</h[1-6]>", "\n", text)
  text = re.sub(r"(?i)</tr>", "\n", text)
  text = re.sub(r"(?is)<[^>]+>", "", text)
  text = html_lib.unescape(text).replace("\xa0", " ")
  return [line.rstrip() for line in text.splitlines()]


def resolve_html_directory(root: Path) -> Path:
  if (root / "tred").exists():
    return root
  if (root / "html" / "tred").exists():
    return root / "html"
  raise ValueError(f"Cannot locate html directory under: {root}")


def parse_tred_html_file(path: Path, data_element_id: str) -> dict[str, Any]:
  lines = strip_html_to_lines(path)
  header_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*{re.escape(data_element_id)}\s+(.+?)\s+\[([A-Z])\]\s*$"
  )
  code_re = re.compile(rf"^\s*{RE_CHANGE_PREFIX}\s*([A-Za-z0-9]+)\s{{2,}}(.+?)\s*$")

  name = ""
  usage_class = "B"
  for line in lines:
    m = header_re.match(line)
    if m:
      name = normalize_spaces(m.group(1))
      usage_class = m.group(2).upper()
      break
  if not name:
    raise ValueError(f"Failed to parse data element header in {path}")

  definition = ""
  repr_s = ""
  codes: dict[str, str] = {}

  i = 0
  n = len(lines)
  while i < n:
    line = lines[i]

    desc_m = re.match(r"^\s*Desc:\s*(.*)$", line)
    if desc_m:
      parts = [desc_m.group(1).strip()]
      i += 1
      while i < n:
        nxt = lines[i]
        if (
            not nxt.strip()
            or re.match(r"^\s*Repr:\s*", nxt)
            or re.match(r"^\s*Code Values:\s*$", nxt, re.IGNORECASE)
        ):
          break
        parts.append(nxt.strip())
        i += 1
      definition = normalize_spaces(" ".join(parts))
      continue

    repr_m = re.match(r"^\s*Repr:\s*([A-Za-z0-9.]+)\s*$", line)
    if repr_m:
      repr_s = repr_m.group(1).strip()
      i += 1
      continue

    if re.match(r"^\s*Code Values:\s*$", line, re.IGNORECASE):
      i += 1
      while i < n:
        nxt = lines[i]
        if re.match(
            r"^\s*(Data Element Cross Reference|Composite .* is used|Segment .* is used|Copyright)\b",
            nxt,
            re.IGNORECASE,
        ):
          break
        code_m = code_re.match(nxt)
        if code_m:
          code = code_m.group(1)
          desc = normalize_spaces(code_m.group(2))
          if desc:
            codes[code] = desc
        i += 1
      continue

    i += 1

  return {
      "id": data_element_id,
      "name": name,
      "class": usage_class if usage_class else "B",
      "definition": definition,
      "repr": repr_s,
      "codes": codes,
  }


def parse_trcd_html_file(path: Path, composite_id: str) -> dict[str, Any]:
  lines = strip_html_to_lines(path)
  header_re = re.compile(rf"^\s*{RE_CHANGE_PREFIX}\s*{re.escape(composite_id)}\s+(.+?)\s*$")
  comp_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*(\d{{3}})\s+(\d{{4}})\s+(.+?)\s+([MC])\s+([A-Za-z0-9.]+)\s*$"
  )

  desc = ""
  for line in lines:
    m = header_re.match(line)
    if m and not m.group(1).lower().startswith("is used"):
      desc = normalize_spaces(m.group(1))
      break
  if not desc:
    raise ValueError(f"Failed to parse composite header in {path}")

  definition = ""
  components: list[dict[str, str]] = []
  i = 0
  n = len(lines)
  while i < n:
    line = lines[i]
    desc_m = re.match(r"^\s*Desc:\s*(.*)$", line)
    if desc_m:
      parts = [desc_m.group(1).strip()]
      i += 1
      while i < n:
        nxt = lines[i]
        if not nxt.strip() or comp_re.match(nxt):
          break
        parts.append(nxt.strip())
        i += 1
      definition = normalize_spaces(" ".join(parts))
      continue

    comp_m = comp_re.match(line)
    if comp_m:
      components.append(
          {
              "seq": comp_m.group(1),
              "de_id": comp_m.group(2),
              "desc": normalize_spaces(comp_m.group(3)),
              "req": comp_m.group(4),
              "repr": comp_m.group(5),
          }
      )
    i += 1

  return {
      "id": composite_id,
      "desc": desc,
      "definition": definition,
      "components": components,
  }


def parse_trsd_html_file(path: Path, segment_id: str) -> dict[str, Any]:
  lines = strip_html_to_lines(path)
  header_re = re.compile(rf"^\s*{RE_CHANGE_PREFIX}\s*{re.escape(segment_id)}\s{{2,}}(.+?)\s*$")
  simple_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*(\d{{3}})\s+(\d{{4}})\s+(.+?)\s+([MC])\s+(\d+)\s+([A-Za-z0-9.]+)\s*$"
  )
  comp_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*(\d{{3}})\s+([A-Z]\d{{3}})\s+(.+?)\s+([MC])\s+(\d+)\s*$"
  )

  desc = ""
  for line in lines:
    m = header_re.match(line)
    if m and not m.group(1).lower().startswith("is used"):
      desc = normalize_spaces(m.group(1))
      break
  if not desc:
    raise ValueError(f"Failed to parse segment header in {path}")

  function = ""
  entries: list[dict[str, str]] = []
  i = 0
  n = len(lines)
  while i < n:
    line = lines[i]

    func_m = re.match(r"^\s*Function:\s*(.*)$", line)
    if func_m:
      parts = [func_m.group(1).strip()]
      i += 1
      while i < n:
        nxt = lines[i]
        if not nxt.strip() or simple_re.match(nxt) or comp_re.match(nxt):
          break
        parts.append(nxt.strip())
        i += 1
      function = normalize_spaces(" ".join(parts))
      continue

    simple_m = simple_re.match(line)
    if simple_m:
      entries.append(
          {
              "seq": simple_m.group(1),
              "id": simple_m.group(2),
              "desc": normalize_spaces(simple_m.group(3)),
              "req": simple_m.group(4),
              "max": simple_m.group(5),
              "repr": simple_m.group(6),
              "kind": "simple",
          }
      )
      i += 1
      continue

    comp_m = comp_re.match(line)
    if comp_m:
      entries.append(
          {
              "seq": comp_m.group(1),
              "id": comp_m.group(2),
              "desc": normalize_spaces(comp_m.group(3)),
              "req": comp_m.group(4),
              "max": comp_m.group(5),
              "kind": "composite",
          }
      )
      i += 1
      continue

    i += 1

  return {
      "id": segment_id,
      "desc": desc,
      "function": function,
      "entries": entries,
  }


def build_source_from_html_directory(html_root: Path, source_root: Path, release: str) -> None:
  html_root = resolve_html_directory(html_root)
  suffix = release[1:] if release.startswith("D") else release

  tred_dir = html_root / "tred"
  trcd_dir = html_root / "trcd"
  trsd_dir = html_root / "trsd"
  trmd_dir = html_root / "trmd"

  for d in (tred_dir, trcd_dir, trsd_dir, trmd_dir):
    if not d.exists():
      raise ValueError(f"Missing required html subdirectory: {d}")

  eded_out = source_root / "eded"
  edcd_out = source_root / "edcd"
  edsd_out = source_root / "edsd"
  uncl_out = source_root / "uncl"
  edmd_out = source_root / "edmd"
  for d in (eded_out, edcd_out, edsd_out, uncl_out, edmd_out):
    d.mkdir(parents=True, exist_ok=True)

  data_elements: dict[str, dict[str, Any]] = {}
  for path in sorted(tred_dir.glob("tred*.htm")):
    m = re.match(r"tred(\d{4})$", path.stem, re.IGNORECASE)
    if not m:
      continue
    de_id = m.group(1)
    data_elements[de_id] = parse_tred_html_file(path, de_id)

  with (eded_out / f"EDED.{suffix}").open("w", encoding="utf-8", newline="\n") as f:
    for de_id in sorted(data_elements.keys()):
      item = data_elements[de_id]
      usage_class = item.get("class", "B")
      f.write(f"     {de_id}  {item['name']} [{usage_class}]\n")
      if item.get("definition"):
        f.write(f"     Desc: {item['definition']}\n")
      if item.get("repr"):
        f.write(f"     Repr: {item['repr']}\n")
      f.write("\n")

  with (uncl_out / f"UNCL.{suffix}").open("w", encoding="utf-8", newline="\n") as f:
    for de_id in sorted(data_elements.keys()):
      item = data_elements[de_id]
      codes = item.get("codes") or {}
      if not codes:
        continue
      usage_class = item.get("class", "B")
      f.write(f"     {de_id}  {item['name']} [{usage_class}]\n")
      if item.get("definition"):
        f.write(f"     Desc: {item['definition']}\n")
      if item.get("repr"):
        f.write(f"     Repr: {item['repr']}\n")
      for code, desc in codes.items():
        f.write(f"     {code}  {desc}\n")
      f.write("\n")

  composites: dict[str, dict[str, Any]] = {}
  for path in sorted(trcd_dir.glob("trcd*.htm")):
    m = re.match(r"trcd([ce]\d{3})$", path.stem, re.IGNORECASE)
    if not m:
      continue
    comp_id = m.group(1).upper()
    composites[comp_id] = parse_trcd_html_file(path, comp_id)

  with (edcd_out / f"EDCD.{suffix}").open("w", encoding="utf-8", newline="\n") as f:
    for comp_id in sorted(composites.keys()):
      item = composites[comp_id]
      f.write(f"       {comp_id} {item['desc']}\n")
      if item.get("definition"):
        f.write(f"       Desc: {item['definition']}\n")
      for comp in item["components"]:
        f.write(
            f"{comp['seq']}    {comp['de_id']}  {comp['desc']}  {comp['req']}      {comp['repr']}\n"
        )
      f.write("\n")

  segments: dict[str, dict[str, Any]] = {}
  service_segment_ids = {"UGH", "UGT", "UNH", "UNS", "UNT"}
  for path in sorted(trsd_dir.glob("trsd*.htm")):
    m = re.match(r"trsd([a-z0-9]{3})$", path.stem, re.IGNORECASE)
    if not m:
      continue
    seg_id = m.group(1).upper()
    if seg_id in service_segment_ids:
      continue
    segments[seg_id] = parse_trsd_html_file(path, seg_id)

  with (edsd_out / f"EDSD.{suffix}").open("w", encoding="utf-8", newline="\n") as f:
    for seg_id in sorted(segments.keys()):
      item = segments[seg_id]
      f.write(f"       {seg_id}  {item['desc']}\n")
      if item.get("function"):
        f.write(f"       Function: {item['function']}\n")
      for entry in item["entries"]:
        if entry["kind"] == "simple":
          f.write(
              f"{entry['seq']}    {entry['id']}  {entry['desc']}  {entry['req']}    {entry['max']} {entry['repr']}\n"
          )
        else:
          f.write(
              f"{entry['seq']}    {entry['id']}  {entry['desc']}  {entry['req']}    {entry['max']}\n"
          )
      f.write("\n")

  for path in sorted(trmd_dir.glob("*_c.htm")):
    msg = path.stem.split("_", 1)[0].upper()
    out_path = edmd_out / f"{msg}_D.{suffix}"
    lines = strip_html_to_lines(path)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_eded(path: Path) -> dict[str, dict[str, Any]]:
  lines = read_lines(path)
  header_re = re.compile(r"^\s{5}(\d{4})\s{2,}(.+?)\s+\[[A-Z]\]\s*$")
  result: dict[str, dict[str, Any]] = {}

  i = 0
  n = len(lines)
  while i < n:
    m = header_re.match(lines[i])
    if not m:
      i += 1
      continue

    elem_id = m.group(1)
    name = normalize_spaces(m.group(2))
    definition = ""
    repr_s = ""

    i += 1
    while i < n and not header_re.match(lines[i]):
      line = lines[i]
      desc_m = re.match(r"^\s+Desc:\s*(.*)$", line)
      if desc_m:
        parts = [desc_m.group(1).strip()]
        i += 1
        while i < n:
          cont = lines[i]
          if (
              re.match(r"^\s+Repr:", cont)
              or re.match(r"^\s+Note:", cont)
              or re.match(r"^\s*$", cont)
              or re.match(r"^-+\s*$", cont)
              or header_re.match(cont)
          ):
            break
          if re.match(r"^\s{11,}\S", cont):
            parts.append(cont.strip())
            i += 1
            continue
          break
        definition = normalize_spaces(" ".join(parts))
        continue

      repr_m = re.match(r"^\s+Repr:\s*([A-Za-z0-9.]+)\s*$", line)
      if repr_m:
        repr_s = repr_m.group(1)

      i += 1

    data_type, min_len, max_len = parse_rep(repr_s)
    result[elem_id] = {
        "id": elem_id,
        "name": name,
        "definition": definition,
        "repr": repr_s,
        "dataType": data_type,
        "minLength": min_len,
        "maxLength": max_len,
    }

  return result


def parse_uncl(path: Path) -> tuple[dict[str, dict[str, str]], dict[str, dict[str, Any]]]:
  lines = read_lines(path)
  header_re = re.compile(r"^\s{5}(\d{4})\s{2,}(.+?)\s+\[[A-Z]\]\s*$")
  code_re = re.compile(rf"^\s{{5}}{RE_CHANGE_PREFIX}\s*([A-Za-z0-9]+)\s{{2,}}(.+?)\s*$")

  code_lists_by_id: dict[str, dict[str, Any]] = {}
  current: dict[str, Any] | None = None
  saw_repr = False

  for line in lines:
    header = header_re.match(line)
    if header:
      current = {
          "id": header.group(1),
          "name": normalize_spaces(header.group(2)),
          "codes": {},
      }
      code_lists_by_id[current["id"]] = current
      saw_repr = False
      continue

    if not current:
      continue

    if re.match(r"^\s+Repr:\s*", line):
      saw_repr = True
      continue

    if not saw_repr:
      continue

    code_m = code_re.match(line)
    if not code_m:
      continue

    code = code_m.group(1)
    desc = normalize_spaces(code_m.group(2))
    if desc:
      current["codes"][code] = desc

  qualifiers: dict[str, dict[str, str]] = {}
  for item in code_lists_by_id.values():
    if item["codes"]:
      qualifiers[item["name"]] = item["codes"]

  return qualifiers, code_lists_by_id


def parse_edcd(
    path: Path,
    data_elements: dict[str, dict[str, Any]],
    code_lists_by_id: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
  lines = read_lines(path)
  header_re = re.compile(r"^\s{7}([CE]\d{3})\s+(.+?)\s*$")
  comp_start_re = re.compile(rf"^\s*{RE_CHANGE_PREFIX}\s*\d{{3}}\s+\d{{4}}\s+")
  comp_complete_re = re.compile(r"\s[MC]\s+[A-Za-z0-9.]+\s*$")
  comp_parse_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*\d{{3}}\s+(\d{{4}})\s+(.+?)\s+([MC])\s+([A-Za-z0-9.]+)\s*$"
  )

  composites: dict[str, dict[str, Any]] = {}

  i = 0
  n = len(lines)
  while i < n:
    header = header_re.match(lines[i])
    if not header:
      i += 1
      continue

    comp_id = header.group(1)
    comp_desc = normalize_spaces(header.group(2))
    definition = ""
    components: list[dict[str, Any]] = []

    i += 1
    while i < n and not header_re.match(lines[i]):
      line = lines[i]

      desc_m = re.match(r"^\s+Desc:\s*(.*)$", line)
      if desc_m:
        parts = [desc_m.group(1).strip()]
        i += 1
        while i < n:
          cont = lines[i]
          if (
              comp_start_re.match(cont)
              or re.match(r"^\s+Note:", cont)
              or re.match(r"^\s*$", cont)
              or re.match(r"^-+\s*$", cont)
              or header_re.match(cont)
          ):
            break
          if re.match(r"^\s{7,}\S", cont):
            parts.append(cont.strip())
            i += 1
            continue
          break
        definition = normalize_spaces(" ".join(parts))
        continue

      if comp_start_re.match(line):
        logical = line
        j = i + 1
        while not comp_complete_re.search(logical.strip()) and j < n:
          nxt = lines[j]
          if (
              re.match(r"^\s*$", nxt)
              or re.match(r"^\s+Note:", nxt)
              or re.match(r"^-+\s*$", nxt)
              or header_re.match(nxt)
              or comp_start_re.match(nxt)
          ):
            break
          logical += " " + nxt.strip()
          j += 1

        parsed = comp_parse_re.match(logical)
        if parsed:
          de_id = parsed.group(1)
          de = data_elements.get(de_id, {})
          data_type, min_len, max_len = parse_rep(parsed.group(4) or de.get("repr", ""))
          qualifier_name = (code_lists_by_id.get(de_id) or {}).get("name")

          comp_item: dict[str, Any] = {
              "Id": de_id,
              "Desc": normalize_spaces(parsed.group(2)) or de.get("name") or de_id,
              "DataType": data_type or de.get("dataType") or "",
              "Required": parsed.group(3) == "M",
              "MinLength": min_len,
              "MaxLength": max_len,
              "Definition": de.get("definition", ""),
          }
          if qualifier_name:
            comp_item["QualifierRef"] = qualifier_name
          components.append(comp_item)

        i = j
        continue

      i += 1

    composites[comp_id] = {
        "id": comp_id,
        "desc": comp_desc,
        "definition": definition,
        "components": components,
    }

  return composites


def parse_edsd(
    path: Path,
    data_elements: dict[str, dict[str, Any]],
    composites: dict[str, dict[str, Any]],
    code_lists_by_id: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
  lines = read_lines(path)
  header_re = re.compile(r"^\s{7}([A-Z]{3})\s{2,}(.+?)\s*$")
  elem_start_re = re.compile(rf"^\s*{RE_CHANGE_PREFIX}\s*\d{{3}}\s+[A-Z0-9]{{4}}\s+")
  elem_complete_re = re.compile(r"\s[MC]\s+\d+(\s+[A-Za-z0-9.]+)?\s*$")
  simple_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*\d{{3}}\s+([A-Z0-9]{{4}})\s+(.+?)\s+([MC])\s+(\d+)\s+([A-Za-z0-9.]+)\s*$"
  )
  comp_re = re.compile(
      rf"^\s*{RE_CHANGE_PREFIX}\s*\d{{3}}\s+([A-Z0-9]{{4}})\s+(.+?)\s+([MC])\s+(\d+)\s*$"
  )

  segments: dict[str, dict[str, Any]] = {}

  i = 0
  n = len(lines)
  while i < n:
    header = header_re.match(lines[i])
    if not header:
      i += 1
      continue

    seg_id = header.group(1)
    seg_desc = normalize_spaces(header.group(2))
    purpose = ""
    elements: list[dict[str, Any]] = []

    i += 1
    while i < n and not header_re.match(lines[i]):
      line = lines[i]

      func_m = re.match(r"^\s+Function:\s*(.*)$", line)
      if func_m:
        parts = [func_m.group(1).strip()]
        i += 1
        while i < n:
          cont = lines[i]
          if (
              re.match(r"^\s*$", cont)
              or elem_start_re.match(cont)
              or re.match(r"^\s+Note:", cont)
              or re.match(r"^-+\s*$", cont)
              or header_re.match(cont)
          ):
            break
          if re.match(r"^\s{17,}\S", cont):
            parts.append(cont.strip())
            i += 1
            continue
          break
        purpose = normalize_spaces(" ".join(parts))
        continue

      if elem_start_re.match(line):
        logical = line
        j = i + 1
        while not elem_complete_re.search(logical.strip()) and j < n:
          nxt = lines[j]
          if (
              re.match(r"^\s*$", nxt)
              or re.match(r"^\s+Note:", nxt)
              or re.match(r"^-+\s*$", nxt)
              or header_re.match(nxt)
              or elem_start_re.match(nxt)
          ):
            break
          logical += " " + nxt.strip()
          j += 1

        simple_m = simple_re.match(logical)
        comp_m = comp_re.match(logical) if not simple_m else None

        if comp_m:
          elem_id = comp_m.group(1)
          comp_def = composites.get(elem_id, {})
          seg_elem: dict[str, Any] = {
              "Id": elem_id,
              "Desc": normalize_spaces(comp_m.group(2)),
              "Required": comp_m.group(3) == "M",
          }
          if comp_def.get("components"):
            seg_elem["Components"] = copy.deepcopy(comp_def["components"])
          if comp_def.get("definition"):
            seg_elem["Definition"] = comp_def["definition"]
          elements.append(seg_elem)

        elif simple_m:
          elem_id = simple_m.group(1)
          de = data_elements.get(elem_id, {})
          data_type, min_len, max_len = parse_rep(simple_m.group(5) or de.get("repr", ""))
          qualifier_name = (code_lists_by_id.get(elem_id) or {}).get("name")
          seg_elem = {
              "Id": elem_id,
              "Desc": normalize_spaces(simple_m.group(2)),
              "DataType": data_type or de.get("dataType") or "",
              "Required": simple_m.group(3) == "M",
              "MinLength": min_len,
              "MaxLength": max_len,
              "Definition": de.get("definition", ""),
          }
          if qualifier_name:
            seg_elem["QualifierRef"] = qualifier_name
          elements.append(seg_elem)

        i = j
        continue

      i += 1

    seg_obj: dict[str, Any] = {"Desc": seg_desc, "Elements": elements}
    if purpose:
      seg_obj["Purpose"] = purpose
    segments[seg_id] = seg_obj

  return segments


def parse_version_from_edmd_file(path: Path, release: str) -> tuple[str, dict[str, Any]]:
  lines = read_lines(path)
  # Parse from the right-most "Req + Max + ASCII tree suffix" columns.
  row_re = re.compile(r"^\d{5}\s+(.+?)\s+([MC])\s+(\d+)\s*([-+| ]*)$")
  entries: list[dict[str, Any]] = []
  prev_depth = 0

  for line in lines:
    if not re.match(r"^\d{5}\s", line):
      continue
    m = row_re.match(line)
    if not m:
      continue

    body = m.group(1).strip()
    req = m.group(2)
    max_count = int(m.group(3))
    bars = m.group(4).count("|")

    if "Segment group" in body:
      g = re.search(r"Segment group\s+(\d+)", body, re.IGNORECASE)
      if not g:
        continue
      depth = bars
      entries.append(
          {
              "type": "group",
              # Group lines map directly to tree depth by "|" count.
              "depth": depth,
              "req": req,
              "max": max_count,
          }
      )
      prev_depth = depth
      continue

    s = re.match(r"^([A-Z0-9]{3})\b", body)
    if not s:
      continue
    # Segment lines sometimes reduce "|" by one on the last child and mark closure with "+".
    depth = bars
    if "+" in m.group(4) and prev_depth > bars:
      depth = prev_depth
    entries.append(
        {
            "type": "segment",
            "depth": depth,
            "req": req,
            "max": max_count,
            "tag": s.group(1),
        }
    )
    prev_depth = depth

  root: list[dict[str, Any]] = []
  stack: dict[int, dict[str, Any]] = {}  # active group by depth

  for entry in entries:
    depth = int(entry["depth"])

    if entry["type"] == "group":
      # New group at this depth replaces sibling and closes deeper groups.
      for k in sorted([k for k in stack.keys() if k >= depth]):
        stack.pop(k, None)
      parent = root if depth == 0 else stack.get(depth - 1, {}).get("children", root)
      group_node = {"req": entry["req"], "max": entry["max"], "children": []}
      parent.append(group_node)
      stack[depth] = group_node
    else:
      # Segment at depth d belongs to group depth d-1; close deeper groups first.
      for k in sorted([k for k in stack.keys() if k > depth - 1]):
        stack.pop(k, None)
      parent = root if depth == 0 else stack.get(depth - 1, {}).get("children", root)
      parent.append({"tag": entry["tag"], "req": entry["req"], "max": entry["max"]})

  def find_first_tag(nodes: list[dict[str, Any]]) -> str:
    for node in nodes:
      if "tag" in node:
        return node["tag"]
      nested = find_first_tag(node.get("children", []))
      if nested:
        return nested
    return "SG"

  loop_counters: dict[str, int] = {}

  def to_schema_nodes(nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for node in nodes:
      if "tag" in node:
        seg: dict[str, Any] = {"Id": node["tag"]}
        if node["req"] == "C":
          seg["Min"] = 0
        if int(node["max"]) != 1:
          seg["Max"] = int(node["max"])
        out.append(seg)
        continue

      children = node.get("children", [])
      if not children:
        continue

      base = find_first_tag(children)
      loop_counters[base] = loop_counters.get(base, 0) + 1
      loop_node: dict[str, Any] = {"Id": f"{base}Loop{loop_counters[base]}"}
      if node.get("req") == "C":
        loop_node["Min"] = 0
      if int(node.get("max", 1)) != 1:
        loop_node["Max"] = int(node["max"])
      loop_node["Loop"] = to_schema_nodes(children)
      out.append(loop_node)
    return out

  suffix = release[1:] if release.startswith("D") else release
  doc_type = re.sub(rf"_D\.{re.escape(suffix)}$", "", path.name)
  key = f"{release}_{doc_type}"
  val = {
      "Release": release,
      "DocumentType": doc_type,
      "TransactionSet": to_schema_nodes(root),
  }
  return key, val


def ensure_release_code_qualifier(qualifiers: dict[str, dict[str, str]], release: str) -> None:
  rel_map = qualifiers.get("Message release number")
  if not isinstance(rel_map, dict):
    return

  code = release[1:] if release.startswith("D") else release
  if code in rel_map:
    return

  m = re.match(r"^(\d{2})([A-Z])$", code)
  if not m:
    return

  yy = int(m.group(1))
  cycle = m.group(2)
  year = 2000 + yy if yy <= 50 else 1900 + yy
  rel_map[code] = f"Release {year} - {cycle}"


def generate(args: argparse.Namespace) -> dict[str, Any]:
  release = args.release.upper()
  suffix = release[1:] if release.startswith("D") else release

  if not args.source_root and not args.html_zip and not args.html_root:
    raise ValueError("Either --source-root or --html-zip/--html-root must be provided.")
  if args.html_zip and args.html_root:
    raise ValueError("Use only one of --html-zip or --html-root.")

  source_root: Path
  source_mode = "text"
  if args.html_zip or args.html_root:
    source_mode = "html"
    work_root = Path(tempfile.mkdtemp(prefix=f"edifact_{release.lower()}_"))
    if args.html_zip:
      html_extract = work_root / "html_extract"
      html_extract.mkdir(parents=True, exist_ok=True)
      with zipfile.ZipFile(args.html_zip) as zf:
        zf.extractall(html_extract)
      html_root = html_extract
    else:
      html_root = Path(args.html_root)

    source_root = work_root / "source"
    build_source_from_html_directory(html_root, source_root, release)
  else:
    source_root = Path(args.source_root)

  project_root = Path(args.project_root)

  eded_path = source_root / "eded" / f"EDED.{suffix}"
  edcd_path = source_root / "edcd" / f"EDCD.{suffix}"
  edsd_path = source_root / "edsd" / f"EDSD.{suffix}"
  uncl_path = source_root / "uncl" / f"UNCL.{suffix}"
  edmd_dir = source_root / "edmd"

  data_elements = parse_eded(eded_path)
  qualifiers, code_lists_by_id = parse_uncl(uncl_path)
  composites = parse_edcd(edcd_path, data_elements, code_lists_by_id)
  segments = parse_edsd(edsd_path, data_elements, composites, code_lists_by_id)

  if args.fallback_release:
    fallback_release = args.fallback_release.upper()
    fallback_path = (
        project_root
        / "src"
        / "schemas"
        / "edifact"
        / fallback_release
        / f"{fallback_release}.json"
    )
    if fallback_path.exists():
      fallback = json.loads(fallback_path.read_text(encoding="utf-8"))
      for service_seg in ["UGH", "UGT", "UNH", "UNS", "UNT"]:
        if service_seg not in segments and service_seg in fallback.get("Segments", {}):
          segments[service_seg] = fallback["Segments"][service_seg]
      for k, v in fallback.get("Qualifiers", {}).items():
        qualifiers.setdefault(k, v)

  ensure_release_code_qualifier(qualifiers, release)

  release_schema = {
      "Release": release,
      "Qualifiers": qualifiers,
      "Segments": segments,
  }

  doc_entries: list[tuple[str, dict[str, Any]]] = []
  for file_path in sorted(edmd_dir.iterdir()):
    if not file_path.is_file():
      continue
    if not re.search(rf"_D\.{re.escape(suffix)}$", file_path.name):
      continue
    doc_entries.append(parse_version_from_edmd_file(file_path, release))

  doc_entries.sort(key=lambda x: x[0])
  doc_types: dict[str, Any] = {}
  for key, val in doc_entries:
    doc_types[key] = val

  version_schema = {
      "Release": release,
      "DocumentTypes": doc_types,
  }

  out_dir = project_root / "src" / "schemas" / "edifact" / release
  out_dir.mkdir(parents=True, exist_ok=True)

  (out_dir / f"{release}.json").write_text(
      json.dumps(release_schema, ensure_ascii=False, separators=(",", ":")),
      encoding="utf-8",
  )
  (out_dir / f"{release}_versions.json").write_text(
      json.dumps(version_schema, ensure_ascii=False, separators=(",", ":")),
      encoding="utf-8",
  )

  return {
      "release": release,
      "sourceMode": source_mode,
      "sourceRoot": str(source_root),
      "output_dir": str(out_dir),
      "segment_count": len(segments),
      "qualifier_count": len(qualifiers),
      "document_type_count": len(doc_types),
  }


def build_arg_parser() -> argparse.ArgumentParser:
  p = argparse.ArgumentParser(description="Generate project-format EDIFACT schema from UNECE directory files.")
  p.add_argument("--source-root", help="Directory containing eded/edcd/edsd/uncl/edmd subfolders.")
  p.add_argument("--html-zip", help="UNECE *_html.zip package path (e.g. d17a_html.zip).")
  p.add_argument("--html-root", help="Extracted html package root that contains tred/trcd/trsd/trmd.")
  p.add_argument("--release", required=True, help="Release like D20B, D21A, D22B.")
  p.add_argument("--project-root", default=".", help="Project root (default: current directory).")
  p.add_argument(
      "--fallback-release",
      default="D16B",
      help="Existing project release used for fallback service segments/qualifiers (default: D16B).",
  )
  return p


def main() -> None:
  parser = build_arg_parser()
  args = parser.parse_args()
  summary = generate(args)
  print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
  main()
