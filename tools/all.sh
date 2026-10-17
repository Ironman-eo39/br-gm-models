#!/bin/bash
# render every registry asset to shots/<name>.png and build shots/montage.png (starts its own server)
cd "$(dirname "$0")/.."
python3 -m http.server 8123 >/dev/null 2>&1 & SRV=$!
sleep 1
for a in $(grep -oP "^  '?\K[a-z-]+(?='?:)" src/registry.js | grep -v '^group$'); do
  timeout 40 node tools/shot.mjs "asset=$a&ui=0&t=1&view=front" shots/$a.png 600 520 2>&1 | grep -v "no console output" | head -3 | sed "s/^/$a: /"
done
kill $SRV
python3 - <<'PY'
from PIL import Image, ImageDraw
import glob,os
fs=[f for f in sorted(glob.glob('shots/*.png')) if 'montage' not in f and 'road' not in f]
cell=(420,364); cols=5; rows=(len(fs)+cols-1)//cols
M=Image.new('RGB',(cell[0]*cols,cell[1]*rows),(20,20,20)); d=ImageDraw.Draw(M)
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize(cell); x,y=(i%cols)*cell[0],(i//cols)*cell[1]; M.paste(im,(x,y)); d.text((x+6,y+4),os.path.basename(f)[:-4],fill=(255,255,0))
M.save('shots/montage.png'); print(M.size,len(fs))
PY
