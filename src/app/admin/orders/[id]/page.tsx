type Params = Promise<{ readonly id: string }>;

export default async function AdminOrderDetailPage({ params }: Readonly<{ params: Params }>) {
  const { id } = await params;
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <h1>Order {id}</h1>
    </div>
  );
}
