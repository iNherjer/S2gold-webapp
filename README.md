# Siedler II Gold – iPad Webplayer

Experimenteller Browser-Webplayer für **Siedler II Gold** mit js-dos 8 und iPad-Touch-Eingaben.

## Status\n- EXE-Prüfung: Datei- und Signaturkontrolle lokal im Browser (ohne Entpackung und ohne Upload).
- GitHub-Pages-Grundgerüst und lokaler ZIP-Import der **installierten DOS-Dateien**.
- DOSBox-Test und Spielstart sind **noch nicht auf einem iPad verifiziert**.
- **Der direkte Import der GOG-Inno-Setup-EXE funktioniert noch nicht.** Das ist der nächste Arbeitsschritt.
- Die Spielinstallation wird noch nicht dauerhaft im Browser gespeichert.
- Keine Originalspieldateien im Repository ablegen.

## GitHub Pages
Repository > Settings > Pages > Build and deployment > Deploy from a branch > main > /(root).

Erwartete Adresse: https://inherjer.github.io/S2gold-webapp/

## Roadmap
1. WebAssembly-Extraktion der GOG-EXE lokal im Browser verifizieren.
2. DOSBox-Laufzeit und Spielstart mit dem GOG-Build 30319 validieren.
3. iPad-Maus/Touch-Koordinaten und Bedienung optimieren.
4. Installation und Spielstände lokal persistieren.
