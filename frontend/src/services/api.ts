import { db } from "./firebase";
import data2019 from "../data/2019.json";

export async function getAllSpecies() {
  const snapshot = await db.collection("species").get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getMonitoringDataByDay(day: string) {
  const doc = await db.collection("monitoring").doc(day).get();
  return doc.data();
}

export async function getDataForMonth(month: number) {
  // const doc = await db.collection("monitoring");
  // const query = await doc.where("year", "==", 2019).get();
  // return query.docs.map((doc) => doc.data());
}

export async function getDataBetweenTwoDates(first: any, second: any) {
  const doc = await db.collection("monitoring");
  const query = await doc
    .where("timestamp", ">=", first)
    .where("timestamp", "<=", second)
    .get();
  return query.docs.map((doc) => doc.data());
}

export function get2019Year() {
  return data2019.filter((el) => {
    return el;
    // return el.month === 4 || el.month === 5 || el.month === 6;
  });
}
