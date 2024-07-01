"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Password must contain atleast 8 characters"),
});

const SignupForm = () => {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    // Register User
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await response.json();

    // Add registered user in `AuthContext`
    if (result.success) {
      dispatch({ type: "login", user: result.user });
      router.push("/");
    }
  };

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="text-center">
        <CardTitle>Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Signup</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
