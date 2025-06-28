import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/Users';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateFields } = body;
    if (!_id) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    }
    const updatedUser = await User.findByIdAndUpdate(_id, updateFields, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User updated successfully.', user: updatedUser }, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully.', user: deletedUser }, { status: 200 });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}