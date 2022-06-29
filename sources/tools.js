import moment from "moment";
import "dotenv/config";

/// unit:
// years	y
// quarters	Q
// months	M
// weeks	w
// days	d
// hours	h
// minutes	m
// seconds	s
// milliseconds	ms
export function nowPlusToTimestamp(value, unit) {
    return moment().add(value, unit).toISOString().replace("T", " ").replace("Z", "");
}

export function nowToTimestamp() {
    return moment().toISOString().replace("T", " ").replace("Z", "");
}

export function url(path) {
    return process.env.PROTOCOL + "://" + process.env.URL + path;
}