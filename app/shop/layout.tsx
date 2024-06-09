import Header from "@/components/Nav/Header"

export default function ShopLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header />
      {children}
    </section>
  )
}