import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase env ausente. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local"
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type Body = {
  full_name?: string;
  email?: string;
  role?: "client" | "team" | "admin";
};

function randomPassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const full_name = body.full_name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role;

    if (!full_name) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }

    if (!role || !["client", "team", "admin"].includes(role)) {
      return NextResponse.json({ error: "Role inválida." }, { status: 400 });
    }

    const { data: existingEmailProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("email", email)
      .maybeSingle();

    if (existingEmailProfile) {
      return NextResponse.json(
        { error: "Já existe um perfil com esse e-mail." },
        { status: 409 }
      );
    }

    const tempPassword = randomPassword(14);

    const { data: createdUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name,
          role,
        },
      });

    if (createUserError || !createdUser.user) {
      return NextResponse.json(
        { error: createUserError?.message || "Erro ao criar usuário no Auth." },
        { status: 400 }
      );
    }

    const authUser = createdUser.user;

    const { data: existingProfileById, error: existingProfileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", authUser.id)
        .maybeSingle();

    if (existingProfileError) {
      return NextResponse.json(
        { error: existingProfileError.message },
        { status: 400 }
      );
    }

    if (existingProfileById) {
      const { error: updateProfileError } = await supabaseAdmin
        .from("profiles")
        .update({
          full_name,
          email,
          role,
        })
        .eq("id", authUser.id);

      if (updateProfileError) {
        return NextResponse.json(
          { error: updateProfileError.message },
          { status: 400 }
        );
      }
    } else {
      const { error: insertProfileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: authUser.id,
          full_name,
          email,
          role,
        });

      if (insertProfileError) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.id);

        return NextResponse.json(
          { error: insertProfileError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        full_name,
        email,
        role,
      },
      tempPassword,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro interno ao criar usuário." },
      { status: 500 }
    );
  }
}