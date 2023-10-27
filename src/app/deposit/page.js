import DepositForm from "../components/DepositForm";

export const metadata = {
  title: "Deposit",
  description: "A decentralized Bitcoin lending application",
};

export default function Deposit() {
  return (
    <div className="min-h-screen text-black bg-white">
      <h2 className="my-12 text-3xl text-center">Deposit BTC to Mint sBTC</h2>
      <DepositForm />
    </div>
  );
}
