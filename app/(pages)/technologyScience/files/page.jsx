"use client";

import { useState, useEffect } from "react";
import { getFiles } from "@/service/uploadService";

export default function FilesPage() {
  const [listFile, setListFile] = useState([]);

  const loadFiles = async () => {
    let res = await getFiles();
    res = await res.json();
    setListFile(res);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  console.log("listFile", listFile);

  return <div></div>;
}
