// Save as:  app/sign-up/[[...sign-up]]/page.jsx
// (create folder "sign-up", inside it a folder literally named "[[...sign-up]]", and this file inside that)
'use client';

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: "#0B0B0D", padding: 24,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: "#D9A441",
          display: "grid", placeItems: "center", color: "#141419", fontWeight: 800,
          fontFamily: "Georgia, serif", fontSize: 26, fontStyle: "italic",
          margin: "0 auto 18px",
        }}>F</div>
        <SignUp
          appearance={{
            variables: { colorPrimary: "#D9A441", colorBackground: "#141419", colorText: "#F2F1EC" },
          }}
          forceRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
