const { exec } = require("child_process");
const fs = require("fs");
const del = require("del");
const path = require("path");
const { src, dest, series } = require("gulp");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const through2 = require("through2");
const es = require("event-stream");
const csv = require("csv-parser");
require("dotenv").config();

// Config here
const config = {
    templateFilePath: "src/certificate.svg",
    dataFilePath: "src/data.csv",
};

function parseCSV(filePath) {
    return new Promise((resolve) => {
        let results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                resolve(results);
            });
    });
}

function replaceTemplate() {
    return new Promise((resolve, reject) => {
        parseCSV(config.dataFilePath).then((data) => {
            let bundle;

            data.forEach((data, i) => {
                let task = src(config.templateFilePath).pipe(
                    rename(function (path) {
                        path.basename += i;
                    })
                );
                Object.keys(data).forEach((key) => {
                    task = task.pipe(replace(key, data[key]));
                });
                bundle = bundle ? es.merge(bundle, task) : task;
            });
            bundle.pipe(dest("dist/")).on("end", () => resolve());
        });
    });
}

function SVGtoPDF() {
    return src("dist/*.svg").pipe(
        through2.obj((file, enc, cb) => {
            const filePath = path.parse(file.path);
            const proc = exec(
                (process.env.INKSCAPE_EXECUTEABLE || "inkscape") +
                    " '" +
                    file.path +
                    "' " +
                    "--export-area-page --batch-process --export-type=pdf" +
                    " " +
                    `--export-filename='${path.join(
                        filePath.dir,
                        filePath.name
                    )}.pdf'`,
                (err, stdout, stderr) => {
                    console.log("STDERR: ", stderr);
                }
            );
            proc.on("exit", () => cb(null, file));
        })
    );
}

function clean() {
    return del("dist/*", { force: true });
}

exports.default = series(clean, replaceTemplate, SVGtoPDF);
