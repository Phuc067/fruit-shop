export default function Order() {
  const listSelectedCart = JSON.parse(sessionStorage.getItem("listSelectedCart"));
  console.log(listSelectedCart);

  return <div>Order</div>;
}
