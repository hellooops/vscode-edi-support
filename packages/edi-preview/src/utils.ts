export class Utils {
  static normalizeMetaDateAndTime(date: string | undefined, time: string | undefined): string {
    if (!date && !time) return "";
    const resultFrags: string[] = [];
    if (date) {
      const dateFrags = [];

      if (date.length === 8) {
        dateFrags.push(date.substring(0, 4));
        date = date.substring(4);
      }

      if (date.length % 2 === 0) {
        for (let i = 0; i < date.length; i = i + 2) {
          dateFrags.push(date.substring(i, i + 2));
        }
      } else {
        dateFrags.push(date);
      }

      resultFrags.push(dateFrags.join("-"));
    }
    if (time) {
      const timeFrags = [];
      if (time.length % 2 === 0) {
        for (let i = 0; i < time.length; i = i + 2) {
          timeFrags.push(time.substring(i, i + 2));
        }
      } else {
        timeFrags.push(time);
      }

      resultFrags.push(timeFrags.join(":"));
    }

    return resultFrags.join(" ");
  }
}