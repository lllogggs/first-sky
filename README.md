# 첫 하늘

출생일, 출생시간, 태어난 곳을 입력하면 태어난 순간의 태양/달/상승궁과 과거 날씨를 결합해 첫 하늘 장면과 해석을 보여주는 정적 웹 앱입니다.

## 실행

브라우저에서 `index.html`을 열면 바로 사용할 수 있습니다.

로컬 서버로 확인하려면:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

이후 `http://127.0.0.1:5173`으로 접속합니다.

## 데이터

- 장소 검색: Open-Meteo Geocoding API
- 과거 날씨: Open-Meteo Historical Weather API
- 점성술 계산: 브라우저 내부 근사 계산

Historical Weather API는 1940년 이후 데이터를 제공합니다. 더 오래된 출생일은 날씨 기록 없음 상태로 해석됩니다.
