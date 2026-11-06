/* Local EXE inspection only. No extraction and no upload. */
async function inspectInstaller(file) {
  if (!file || !/\.exe$/i.test(file.name)) throw new Error('Bitte eine .exe-Datei auswählen.');
  if (file.size < 65536) throw new Error('Datei ist für einen GOG-Installer ungewöhnlich klein.');
  const expected = /setup_the_settlers_2_gold_1\.5\.1_\(german\)_\(30319\)\.exe/i.test(file.name);
  // Read only the first 2 MiB. A full 300 MB read is unnecessary for format diagnostics.
  const prefix = new Uint8Array(await file.slice(0, Math.min(file.size, 2 * 1024 * 1024)).arrayBuffer());
  if (prefix[0] !== 0x4d || prefix[1] !== 0x5a) throw new Error('Kein gültiger Windows-MZ-EXE-Header.');
  const signature = new TextDecoder('latin1').decode(prefix);
  const inno = signature.includes('Inno Setup') || signature.includes('Inno Setup Setup Data');
  const versions = ['1.5.1', '30319'].filter(s => file.name.includes(s));
  return {
    message: 'Lokale Datei erkannt: ' + file.name +
      '\nGröße: ' + (file.size / (1024 * 1024)).toFixed(1) + ' MiB' +
      '\nWindows-EXE: ja' +
      '\nInno-Setup-Signatur im Anfangsbereich: ' + (inno ? 'gefunden' : 'nicht gefunden (nicht abschließend)') +
      '\nBekannter GOG-Build: ' + (expected ? 'Dateiname passt (1.5.1 DE / 30319)' : 'abweichender Dateiname') +
      '\nStatus: Die EXE wurde NICHT entpackt. Ein browserfähiger innoextract-WASM-Build wird noch benötigt. Die Datei bleibt lokal auf deinem Gerät.'
  };
}
