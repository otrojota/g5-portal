import { ZVC, ZInput } from "./zvc.js";
const DateTime = luxon.DateTime;

class ZInputDate extends ZInput {
    onThis_init() {
        super.onThis_init();
        this.tz = this.view.getAttribute("data-z-tz") || "America/Santiago";
        this.value = DateTime.fromMillis(Date.now(), {zone: this.tz});
    }
    
    get value() {
        let v = this.view.value;
        let lx = DateTime.fromSQL(v, {zone: this.tz});
        return lx.isValid?lx:null;
    }
    set value(v) {
        this.view.value = v.toSQLDate();
    }
}

ZVC.registerComponent("INPUT", e => (e.getAttribute("type") && e.getAttribute("type").toLowerCase() == "date"), ZInputDate);