interface CardPorps {
  cardTitle: string;
  actions: string[];
}

export const Card = ({ cardTitle, actions }: CardPorps) => {
  return (
    <>
      <div className="cursor-pointer transition ease-in hover:-translate-y-6 hover:bg-green-800 card-box bg-gray-900 p-6 rounded-lg text-slate-300">
        <h2 className="text-[24px] mb-4">{cardTitle}</h2>
        <ul className="space-y-4 text-[18px]">
          {actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </>
  );
};
