import WithdrawForm from "../components/WithdrawForm";

export const metadata = {
  title: "Withdraw",
  description: "A decentralized Bitcoin lending application",
};

export default function Withdraw() {
  return (
    <div className="min-h-screen text-black bg-white">
      <h2 className="my-12 text-3xl text-center">Withdraw SBTC to BTC</h2>
      <WithdrawForm />
    </div>
  );
}
