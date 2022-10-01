import React, { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { auth, fbAnalytics, firestore, storage } from "../firebase/init";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    return await auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (!auth?.currentUser?.emailVerified)
          throw new Error("Please verify your email first");
        fbAnalytics.logEvent("login_success");
        setUser(res.user.uid);
        navigate("/dashboard/events", { replace: true });
      })
      .catch((error) => {
        fbAnalytics.logEvent("login_error", { error: error.message });
        throw error;
      });
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const register = async ({
    email,
    password,
    isOrganiser,
    organiserFirstName,
    organiserLastName,
    organiserBirthdate,
    avatar,
  }) => {
    return await auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        fbAnalytics.logEvent("register_success");
        await auth.currentUser.sendEmailVerification({
          url: "https://red-ribbon-epitech.web.app/signin",
        });
        if (isOrganiser) {
          const snapshot = await storage
            .ref(`images/${res.user.uid}/${avatar.name}`)
            .put(avatar);
          const URL = await snapshot.ref.getDownloadURL();
          await firestore.collection("users").doc(res.user.uid).set({
            email,
            organiser: isOrganiser,
            firstName: organiserFirstName,
            lastName: organiserLastName,
            birthdate: organiserBirthdate,
            avatar: URL,
          });
        } else {
          await firestore
            .collection("users")
            .doc(res.user.uid)
            .set({ email, organiser: isOrganiser });
        }
      })
      .catch((error) => {
        fbAnalytics.logEvent("register_error", { error: error.message });
        throw error;
      });
  };
  const sendPasswordResetMail = async (email) => {
    return await auth
      .fetchSignInMethodsForEmail(email)
      .then((signInMethods) => {
        if (signInMethods.length === 0) {
          throw new Error("No user found with this email.");
        } else {
          return auth.sendPasswordResetEmail(email);
        }
      });
  };
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      sendPasswordResetMail,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
