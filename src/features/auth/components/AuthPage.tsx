import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageSlider } from "../../../components/ui/image-slider";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Chrome, Apple, ArrowLeft, CheckCircle2 } from "lucide-react";
import { type Language } from "../../../types";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

interface AuthPageProps {
  lang: Language;
  onClose: () => void;
  type: "login" | "register" | "forgot_password";
  setType: (type: "login" | "register" | "forgot_password") => void;
}

export default function AuthPage({ lang, onClose, type, setType }: AuthPageProps) {
  const images = [
    "public/images/Log_img2.jpg",
    "public/images/Log_img5.jpg",
    "public/images/Log_img4.jpg",
    "public/images/Log_img1.jpg",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const isLogin = type === "login";
  const isRegister = type === "register";
  const isForgotPassword = type === "forgot_password";

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthError("");
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      // optionally save user info
      const userRef = doc(db, "users", res.user.uid);
      await setDoc(userRef, { email: res.user.email, username: res.user.displayName || "" }, { merge: true });
      onClose();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setAuthError(error.message);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        let loginEmail = emailOrUsername;
        // Check if it's a username (doesn't contain @)
        if (!loginEmail.includes("@")) {
          const q = query(collection(db, "users"), where("username", "==", emailOrUsername));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            throw new Error(lang === "id" ? "Username tidak ditemukan." : "Username not found.");
          }
          loginEmail = querySnapshot.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, loginEmail, password);
        onClose();
      } else if (isRegister) {
        // check if username already exists
        const q = query(collection(db, "users"), where("username", "==", name));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            throw new Error(lang === "id" ? "Username sudah terdaftar." : "Username already exists.");
        }

        const res = await createUserWithEmailAndPassword(auth, emailOrUsername, password);
        await setDoc(doc(db, "users", res.user.uid), {
          email: emailOrUsername,
          username: name
        });
        onClose();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white md:bg-slate-100/80 md:backdrop-blur-sm p-0 md:p-6 lg:p-12 overflow-y-auto">
      <motion.div 
        className="w-full max-w-6xl md:h-[700px] min-h-screen md:min-h-0 bg-white grid grid-cols-1 lg:grid-cols-2 md:rounded-3xl md:overflow-hidden md:shadow-2xl md:border border-slate-200 relative"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button 
          onClick={() => {
            if (isSuccess && isForgotPassword) {
              setType("login");
              setIsSuccess(false);
            } else if (isForgotPassword && !isSuccess) {
              setType("login");
            } else {
              onClose();
            }
          }}
          className="absolute top-6 left-6 z-10 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-md transition-colors text-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Left side: Image Slider */}
        <div className="hidden lg:block relative h-full">
          <ImageSlider images={images} interval={5000} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute bottom-16 left-12 right-12 z-10 text-white">
            <h2 className="text-4xl font-black mb-4 tracking-tight">FITOLOGY.</h2>
            <p className="text-white/80 text-lg font-medium">
              {lang === "id" ? "Temukan body shape aslimu dan level up gaya OOTD kamu sekarang." : "Discover your true body shape and level up your OOTD styling today."}
            </p>
          </div>
        </div>

        {/* Right side: Auth Form */}
        <div className="w-full h-full bg-white text-slate-900 flex flex-col items-center justify-center p-8 pt-24 md:pt-8 md:p-14 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                className="w-full max-w-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                key={type}
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
                    {isLogin && (lang === "id" ? "Selamat Datang" : "Welcome Back")}
                    {isRegister && (lang === "id" ? "Daftar Akun" : "Create Account")}
                    {isForgotPassword && (lang === "id" ? "Lupa Password" : "Reset Password")}
                  </h1>
                  <p className="text-slate-500">
                    {isLogin && (lang === "id" ? "Masukkan detail akun untuk melanjutkan." : "Enter your credentials to access your account.")}
                    {isRegister && (lang === "id" ? "Bergabunglah untuk mendapatkan akses penuh." : "Join us to get full access to styling guides.")}
                    {isForgotPassword && (lang === "id" ? "Masukkan email yang terdaftar untuk menerima tautan reset password." : "Enter your registered email to receive a password reset link.")}
                  </p>
                </motion.div>

                {!isForgotPassword && (
                  <>
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Button variant="outline" className="w-full h-11 border-slate-200" onClick={handleGoogleLogin}>
                        <Chrome className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" className="w-full h-11 border-slate-200">
                        <Apple className="mr-2 h-4 w-4" />
                        Apple
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase font-medium">
                        <span className="bg-white px-3 text-slate-400">
                          {lang === "id" ? "Atau lanjutkan dengan" : "Or continue with"}
                        </span>
                      </div>
                    </motion.div>
                  </>
                )}

                <motion.form variants={itemVariants} className="space-y-5" onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleAuthSubmit}>
                  {authError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                      {authError}
                    </div>
                  )}
                  {isRegister && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">{lang === "id" ? "Username (Nama Lengkap)" : "Username (Full Name)"}</Label>
                      <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder={lang === "id" ? "Nama Anda" : "Your Name"} required />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{isLogin ? (lang === "id" ? "Email atau Username" : "Email or Username") : "Email"}</Label>
                    <Input id="email" type={isLogin ? "text" : "email"} value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} placeholder={isLogin ? (lang === "id" ? "Email atau Username" : "Email or Username") : "m@example.com"} required />
                  </div>
                  
                  {!isForgotPassword && (
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          {isLogin && (
                            <button 
                              type="button" 
                              onClick={() => setType("forgot_password")}
                              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                                {lang === "id" ? "Lupa password?" : "Forgot password?"}
                            </button>
                          )}
                       </div>
                      <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 mt-4 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {lang === "id" ? "Memproses..." : "Processing..."}
                      </div>
                    ) : (
                      <>
                        {isLogin && (lang === "id" ? "Masuk" : "Log In")}
                        {isRegister && (lang === "id" ? "Daftar" : "Sign Up")}
                        {isForgotPassword && (lang === "id" ? "Kirim Link" : "Send Reset Link")}
                      </>
                    )}
                  </Button>
                </motion.form>

                {!isForgotPassword && (
                  <motion.p variants={itemVariants} className="text-center text-sm text-slate-500 mt-8 font-medium">
                    {isLogin 
                      ? (lang === "id" ? "Belum punya akun? " : "Don't have an account? ")
                      : (lang === "id" ? "Sudah punya akun? " : "Already have an account? ")
                    }
                    <button 
                      onClick={() => setType(isLogin ? "register" : "login")}
                      className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      {isLogin 
                        ? (lang === "id" ? "Daftar" : "Sign up")
                        : (lang === "id" ? "Masuk" : "Log in")
                      }
                    </button>
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div 
                className="w-full max-w-sm text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                key="success"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {lang === "id" ? "Tautan Terkirim" : "Link Sent"}
                </h2>
                <p className="text-slate-500 mb-8">
                  {lang === "id" 
                    ? "Kami telah mengirimkan instruksi untuk menyetel ulang password ke email Anda. Silakan cek kotak masuk atau folder spam Anda." 
                    : "We've sent instructions to reset your password to your email. Please check your inbox or spam folder."}
                </p>
                <Button 
                  onClick={() => {
                    setIsSuccess(false);
                    setType("login");
                  }}
                  className="w-full h-11 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {lang === "id" ? "Kembali ke Masuk" : "Back to Log In"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
