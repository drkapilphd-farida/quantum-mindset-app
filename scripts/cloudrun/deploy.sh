#!/usr/bin/env bash
# Deploy the app to Google Cloud Run (project mindurmind-app, asia-southeast1).
# Since Nov 2026 the live site runs here, not on Vercel — a git push alone
# does NOT update it. Run from the repo root:  bash scripts/cloudrun/deploy.sh
#
# Secrets live only on the Cloud Run service itself. This script reads them
# from there into a build-only .env.production (gitignored, removed after),
# builds the image in Cloud Build, deletes the uploaded source, deploys.
set -euo pipefail
PROJECT=mindurmind-app
REGION=asia-southeast1
SERVICE=web
TAG="$(date +%Y%m%d-%H%M%S)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT/app/web:$TAG"

cd "$(dirname "$0")/../.."
cleanup() {
  rm -f .env.production .env.production.json
  # The uploaded build source contains .env.production: never leave it behind, even when the build fails.
  gcloud storage rm "gs://${PROJECT}_cloudbuild/source/**" --project "$PROJECT" >/dev/null 2>&1 || true
}
trap cleanup EXIT

gcloud run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format=json > .env.production.json
python3 - .env.production.json > .env.production <<'PY'
import json, sys
svc = json.load(open(sys.argv[1]))
for e in svc["spec"]["template"]["spec"]["containers"][0].get("env", []):
    if "value" in e:
        print(e["name"] + "=" + json.dumps(e["value"]))
PY
rm -f .env.production.json
echo "Build env: $(wc -l < .env.production) variables"

gcloud builds submit --project "$PROJECT" --region "$REGION" --tag "$IMAGE" --timeout=40m .
gcloud run deploy "$SERVICE" --project "$PROJECT" --region "$REGION" --image "$IMAGE"

for path in / /api/health; do
  echo "$path -> $(curl -s -o /dev/null -w '%{http_code}' "https://app.mindurmind.org.in$path")"
done
