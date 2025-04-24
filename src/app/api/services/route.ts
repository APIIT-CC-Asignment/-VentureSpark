// import { NextResponse } from "next/server";
// import { dbConnect } from "../../lib/db";
// import Service from "../../models/services";

// export async function GET() {
//   await dbConnect();
//   const services = await Service.findAll();
//   return NextResponse.json(services);
// }

// export async function POST(request: Request) {
//   await dbConnect();
//   const newService = await request.json();
//   const service = await Service.create(newService);
//   return NextResponse.json(service);
// }

// export async function DELETE(request: Request) {
//   await dbConnect();
//   const { id } = await request.json();
//   await Service.destroy({ where: { id } });
//   return NextResponse.json({ success: true });
// }