import { AppButton } from "@/components/ui/AppButton";
import { Text } from "@/components/ui/Form";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Button, StyleSheet, View, TextInput } from "react-native";
 
 export default function Page() {
   const router = useRouter();
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSignUp() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /.{8,}/;

    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      return;
    }

    if (!passwordRegex.test(password)) {
      console.error("Password must be at least 8 characters long");
      return;
    }

    console.log("Sign Up successful");

    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password}),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log(data);
        router.push("/");
      } else {
        alert("Something went wrong");
      }
    });
  }

  return (
     <View style={styles.container}>
       <Text style={styles.title}>Sign Up</Text>

       <Text style={styles.label}>Email</Text>
       <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />

       <Text style={styles.label}>Password</Text>
       <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" autoCapitalize="none" value={password} onChangeText={setPassword} />
       <AppButton onPress={() => {
        handleSignUp();
       }}>Sign Up</AppButton>
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: "#15152F",
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     gap: 12,
   },
   title: {
     fontSize: 32,
     fontWeight: "bold",
   },
   label: {
    fontSize: 16,
    width: "80%",
    textAlign: "left",
   },
   input: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#000000",
    borderColor: "#ccc",
    borderWidth: 1
  },
 });  