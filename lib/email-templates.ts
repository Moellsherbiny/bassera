
const baseTemplate = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
      color: #18181b;
    "
  >
    <div style="padding: 40px 16px;">
      <div
        style="
          max-width: 520px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e4e4e7;
        "
      >
        <!-- Header -->
        <div
          style="
            padding: 28px 32px;
            text-align: center;
            border-bottom: 1px solid #e4e4e7;
          "
        >
          <div
            style="
              font-size: 24px;
              font-weight: 700;
              color: #18181b;
            "
          >
            بَصيرة
          </div>

          <div
            style="
              margin-top: 6px;
              font-size: 11px;
              letter-spacing: 3px;
              color: #71717a;
            "
          >
            BASEERA
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          ${content}
        </div>

        <!-- Footer -->
        <div
          style="
            padding: 20px 32px;
            background-color: #fafafa;
            text-align: center;
            border-top: 1px solid #e4e4e7;
          "
        >
          <p
            style="
              margin: 0;
              font-size: 12px;
              color: #71717a;
            "
          >
            هذه رسالة تلقائية من منصة بَصيرة
          </p>

          <p
            style="
              margin: 6px 0 0;
              font-size: 11px;
              color: #a1a1aa;
            "
          >
            AI-Powered Adaptive Learning
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export function verificationCodeTemplate(code: string) {
  return baseTemplate({
    title: "تأكيد البريد الإلكتروني",
    content: `
      <h1
        style="
          margin: 0 0 12px;
          font-size: 22px;
          color: #18181b;
        "
      >
        تأكيد البريد الإلكتروني
      </h1>

      <p
        style="
          margin: 0 0 24px;
          font-size: 15px;
          line-height: 1.8;
          color: #52525b;
        "
      >
        استخدم رمز التحقق التالي لتأكيد بريدك الإلكتروني وإنشاء حسابك
        على منصة بَصيرة.
      </p>

      <div
        style="
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          background-color: #f4f4f5;
          border-radius: 12px;
        "
      >
        <span
          style="
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #18181b;
          "
        >
          ${code}
        </span>
      </div>

      <p
        style="
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: #71717a;
          text-align: center;
        "
      >
        ينتهي هذا الرمز خلال 10 دقائق.
      </p>

      <p
        style="
          margin: 24px 0 0;
          font-size: 12px;
          line-height: 1.7;
          color: #a1a1aa;
        "
      >
        إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
      </p>
    `,
  });
}

export function passwordResetTemplate(code: string) {
  return baseTemplate({
    title: "إعادة تعيين كلمة المرور",
    content: `
      <h1
        style="
          margin: 0 0 12px;
          font-size: 22px;
          color: #18181b;
        "
      >
        إعادة تعيين كلمة المرور
      </h1>

      <p
        style="
          margin: 0 0 24px;
          font-size: 15px;
          line-height: 1.8;
          color: #52525b;
        "
      >
        استخدم رمز التحقق التالي لإعادة تعيين كلمة المرور الخاصة بحسابك
        في منصة بَصيرة.
      </p>

      <div
        style="
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          background-color: #f4f4f5;
          border-radius: 12px;
        "
      >
        <span
          style="
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #18181b;
          "
        >
          ${code}
        </span>
      </div>

      <p
        style="
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: #71717a;
          text-align: center;
        "
      >
        ينتهي هذا الرمز خلال 10 دقائق.
      </p>

      <p
        style="
          margin: 24px 0 0;
          font-size: 12px;
          line-height: 1.7;
          color: #a1a1aa;
        "
      >
        إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة
        ولا تشارك الرمز مع أي شخص.
      </p>
    `,
  });
}
