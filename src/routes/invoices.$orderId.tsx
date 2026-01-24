import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoices/$orderId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/invoice"!</div>
}
