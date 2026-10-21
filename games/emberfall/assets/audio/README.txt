Achtergrondmuziek voor De Amulet van Emberfall:

    cistern-syntax-96k.mp3   (96 kbps, ≈4,8 MB) — deze speelt het spel af
    cistern-syntax.mp3       (origineel, ≈9 MB) — alleen als bronbestand bewaard

De engine speelt cistern-syntax-96k.mp3 in een lus (zie DEFAULT_MUSIC in
js/engine.js). Ontbreekt het bestand, dan valt het spel terug op de
generatieve ambient-synth. De service worker cachet de muziek niet; de
browser streamt hem zelf.

Opnieuw maken uit het origineel:
    ffmpeg -i cistern-syntax.mp3 -map_metadata -1 -vn -c:a libmp3lame -b:a 96k -ar 44100 cistern-syntax-96k.mp3
