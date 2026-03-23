#!/bin/bash
set -e

SERVER="youtrack"
IMAGE="subs-manager"
TMP="/tmp/${IMAGE}.tar.gz"

echo "==> Building Docker image locally..."
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://oxtypquwqghyvqiahctw.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RGL-siH1mnJe39PfefUC4A_vEfXfHW2 \
  -t $IMAGE .

echo "==> Saving and compressing image..."
docker save $IMAGE | gzip > $TMP

echo "==> Uploading to server..."
scp $TMP $SERVER:/tmp/${IMAGE}.tar.gz

echo "==> Deploying on server..."
ssh $SERVER "
  docker stop $IMAGE 2>/dev/null || true
  docker rm $IMAGE 2>/dev/null || true
  gunzip -c /tmp/${IMAGE}.tar.gz | docker load
  docker run -d --name $IMAGE -p 3000:3000 --restart unless-stopped --memory=256m $IMAGE
  rm /tmp/${IMAGE}.tar.gz
  sleep 2
  curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3000
"

rm $TMP
echo "==> Deploy complete!"
