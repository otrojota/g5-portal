VERSION=0.02
docker buildx build --push --platform linux/amd64,linux/arm64 -t docker.homejota.net/mf/portal:latest -t docker.homejota.net/mf/portal:$VERSION .