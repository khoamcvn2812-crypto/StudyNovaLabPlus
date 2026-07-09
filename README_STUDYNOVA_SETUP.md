# StudyNova Lab — Deploy-ready web package

Bộ này gồm:

- `index.html` — StudyNova Lab chính: Vocabulary, Chunks, Speaking, Test, Mistake Bank, Landing page.
- `studynova_writing_vault.html` — StudyNova Lab Writing Vault.
- `ielts_writing_vault.html` — file redirect giữ tương thích link cũ.
- `api/ai.js` — Vercel serverless AI endpoint.
- `package.json` — dependency cho endpoint AI.
- `firestore.rules` — rules bảo vệ dữ liệu người dùng theo UID.

## 1) Upload lên GitHub/Vercel

Upload toàn bộ thư mục này lên GitHub, giữ đúng cấu trúc:

```text
index.html
studynova_writing_vault.html
ielts_writing_vault.html
package.json
api/ai.js
firestore.rules
```

Trên Vercel, import repository và deploy như web bình thường.

## 2) Bật đăng nhập Email/Google + đồng bộ online

Web đã có sẵn UI đăng nhập và code Firebase, nhưng cần config Firebase của bạn.

### Làm trong Firebase Console

1. Tạo Firebase project.
2. Vào Authentication → Sign-in method.
3. Bật Email/Password.
4. Bật Google.
5. Vào Firestore Database → Create database.
6. Vào Project settings → General → Your apps → Web app.
7. Copy `firebaseConfig`.

### Dán config vào 2 file HTML

Mở `index.html` và `studynova_writing_vault.html`, tìm:

```js
window.STUDYNOVA_FIREBASE_CONFIG = window.STUDYNOVA_FIREBASE_CONFIG || {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
```

Dán config Firebase thật vào cả 2 file.

### Firestore rules

Copy nội dung `firestore.rules` vào Firestore Rules rồi Publish.

## 3) Bật AI nhập ảnh / chữa Writing / chữa Speaking

Endpoint nằm ở:

```text
api/ai.js
```

Trên Vercel:

1. Project → Settings → Environment Variables.
2. Thêm biến:
   - `OPENAI_API_KEY` = API key của bạn
   - `OPENAI_MODEL` = model muốn dùng, mặc định trong code là `gpt-5.5`
3. Redeploy project.

Tuyệt đối không dán OpenAI API key vào file HTML vì người khác có thể xem được.

## 4) Cách hoạt động nếu chưa cấu hình Firebase/API

- Chưa Firebase: web vẫn lưu dữ liệu bằng localStorage như bản cũ.
- Chưa OpenAI API key: nút AI sẽ tự copy prompt để bạn dán thủ công vào ChatGPT/Claude.
- Khi cấu hình đủ: đăng nhập email/Google, sync cloud và AI endpoint sẽ chạy trên Vercel.

## 5) Link giữa hai file

- `index.html` trỏ sang `studynova_writing_vault.html`.
- `studynova_writing_vault.html` trỏ về `index.html`.
- `ielts_writing_vault.html` redirect sang `studynova_writing_vault.html` để link cũ không bị chết.
