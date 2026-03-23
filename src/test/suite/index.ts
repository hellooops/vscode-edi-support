import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');
	const patterns = [
		'suite/commands/**/*.test.js',
		'suite/decorations/**/*.test.js',
		'suite/diagnostics/**/*.test.js',
		'suite/providers/**/*.test.js',
		'suite/utils/ediUtils.test.js',
		'suite/ediPreviewWebview.test.js',
		'suite/extension.activate.test.js',
	];

	return new Promise((c, e) => {
		try {
			const files = patterns.flatMap(pattern => glob.sync(pattern, { cwd: testsRoot }));
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			mocha.run(failures => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}
