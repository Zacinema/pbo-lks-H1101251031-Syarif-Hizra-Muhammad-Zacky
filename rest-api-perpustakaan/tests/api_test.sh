#!/bin/bash

BASE_URL="http://localhost:8000/api"

echo "== Test 1: GET semua buku =="
curl -s $BASE_URL/books
echo -e "\n"

echo "== Test 2: POST buku baru =="
RESPONSE=$(curl -s -X POST $BASE_URL/books -H "Content-Type: application/json" -d '{"judul":"Bumi","penulis":"Tere Liye","tahun":2014,"stok":2}')
echo $RESPONSE
NEW_ID=$(echo $RESPONSE | grep -o '"id": *[0-9]*' | grep -o '[0-9]\+')
echo "ID baru: $NEW_ID"
echo -e "\n"

echo "== Test 3: GET buku ID $NEW_ID =="
curl -s $BASE_URL/books/$NEW_ID
echo -e "\n"

echo "== Test 4: PUT ubah buku =="
curl -s -X PUT $BASE_URL/books/$NEW_ID -H "Content-Type: application/json" -d '{"judul":"Bumi Revisi","penulis":"Tere Liye","tahun":2015,"stok":5}'
echo -e "\n"

echo "== Test 5: DELETE buku =="
curl -s -X DELETE $BASE_URL/books/$NEW_ID
echo -e "\n"

echo "== Test 6: Validasi error =="
curl -s -X POST $BASE_URL/books -H "Content-Type: application/json" -d '{"judul":""}'
echo -e "\n"