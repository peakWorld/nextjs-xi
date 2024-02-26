export function saveBlob(blob: Blob, fileName: string) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
}
