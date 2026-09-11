#!/bin/bash
# SoleVault Scheduled Separate Commit Pusher Script

REPO_DIR="/Users/jaskiratsingh/Desktop/studiowork/SoleVault"
cd "$REPO_DIR" || exit 1

COMMITS=(
  "9edd412" # 4
  "9ae2b83" # 5
  "5b575b8" # 6
  "3dabda2" # 7
  "1e53c00" # 8
  "19ce37b" # 9
  "30e805d" # 10
  "47fa1c8" # 11
  "af5ba17" # 12
  "6e7e2b0" # 13
  "5490601" # 14
  "ca604a5" # 15
  "980f423" # 16
  "589e298" # 17
  "722f0ae" # 18
  "1824a0a" # 19
  "1647a0b" # 20
  "a06e989" # 21
  "2a46c5d" # 22
  "ef71961" # 23
)

for commit in "${COMMITS[@]}"; do
  echo "Pushing single commit: $commit..."
  git push origin "$commit:refs/heads/main"
  sleep 5
done

echo "Done pushing commits!"
