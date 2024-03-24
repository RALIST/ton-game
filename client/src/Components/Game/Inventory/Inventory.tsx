import style from './Inventory.module.css';

const Inventory = ({inventory}: {inventory: any}) => {
  return (
    <div className={style.inventory}>
      {inventory.items.map((item: { item: { name: string }; }, index: number) => {
        return <div key={index}>{item.item.name}</div>
      })}
    </div>
  );
};

export default Inventory;
