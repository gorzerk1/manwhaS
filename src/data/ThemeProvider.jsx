import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';

const MyContext = React.createContext();

function ThemeProvider({ children }) {
  const [categorizedItems, setCategorizedItems] = useState({});
  const [imageColor] = useState('black');
  const [displayItems, setDisplayItems] = useState([]);
  const [traderTimer, setTraderTimer] = useState([]);
  const [itemsWithPrices, setItemsWithPrices] = useState([]); 

  console.log(itemsWithPrices);

  useEffect(() => {
    const categoryMap = {
      'Chest rig': 'Gear',
      'Backpack': 'Gear',
      'Armor': 'Gear',
      'Headwear': 'Gear',
      'Headphones': 'Gear',
      'Armored equipment': 'Gear',
      'Silencer': 'Weapon parts & mods',
      'Scope': 'Weapon parts & mods',
      'Special scope': 'Weapon parts & mods',
      'Flashhider': 'Weapon parts & mods',
      'Mount': 'Weapon parts & mods',
      'Pistol grip': 'Weapon parts & mods',
      'Handguard': 'Weapon parts & mods',
      'Barrel': 'Weapon parts & mods',
      'Stock': 'Weapon parts & mods',
      'Charging handle': 'Weapon parts & mods',
      'Assault scope': 'Weapon parts & mods',
      'UBGL': 'Weapon parts & mods',
      'Vis. observ. device': 'Weapon parts & mods',
      'Sniper rifle': 'Weapons',
      'Assault rifle': 'Weapons',
      'Shotgun': 'Weapons',
      'Marksman rifle': 'Weapons',
      'SMG': 'Weapons',
      'Handgun': 'Weapons',
      'Machinegun': 'Weapons',
      'Assault carbine': 'Weapons',
      'Revolver': 'Weapons',
      'Grenade launcher': 'Weapons',
      'Magazine': 'Magazine',
      'Ammo': 'Ammunition',
      'Fuel': 'Consumable',
      'Food': 'Consumable',
      'Drink': 'Consumable',
      'Medical item': 'Medical',
      'Medikit': 'Medical',
      'Medical supplies': 'Medical',
      'Drug': 'Medical',
      'Stimulant': 'Medical',
      'Mechanical Key': 'Keys',
      'Keycard': 'Keys',
      'Household goods': 'Other',
      'Common container': 'Other',
      'Ammo container': 'Ammunation',
      'Tool': 'Other',
      'Jewelry': 'Other',
      'Electronics': 'Other',
      'Throwable weapon': 'Ammunation',
      'Special item': 'Other',
      'Port. container': 'Other',
      'Info': 'Other',
      'Knife': 'Weapons',
      'Locking container': 'Other',
      'Night Vision': 'Weapon parts & mods',
      'Other': 'Other',
    };

    const barterQuery = gql`
      {
        barters {
          trader {
            name
            imageLink
          }
          level
          rewardItems {
            item {
              name
              image512pxLink
              category {
                name
              }
            }
          }
          requiredItems {
            item {
              name
              image512pxLink
            }
            count
          }
        }
      }
    `;

    const traderTimerQuery = gql`
      {
        traders {
          resetTime
          name
          imageLink
        }
      }
    `;

    const itemsQuery = gql`
      {
        items {
          name
          traderPrices {
            trader {
              name
            }
          }
        }
      }
    `;

    // Fetch data for barters, traders, and items
    const fetchData = async () => {
      try {
        const [barterData, traderData, itemsData] = await Promise.all([
          request('https://api.tarkov.dev/graphql', barterQuery),
          request('https://api.tarkov.dev/graphql', traderTimerQuery),
          request('https://api.tarkov.dev/graphql', itemsQuery),
        ]);

        // Process the barters data
        let categorized = {
          'Gear': [],
          'Weapon parts & mods': [],
          'Weapons': [],
          'Magazine': [],
          'Ammunation': [],
          'Consumable': [],
          'Medical': [],
          'Keys': [],
          'Other': [],
        };

        barterData.barters.forEach(barter => {
          barter.rewardItems.forEach(rewardItem => {
            const itemWithRequiredAndTrader = {
              ...rewardItem.item,
              requiredItems: barter.requiredItems.map(ri => ({
                name: ri.item.name,
                image512pxLink: ri.item.image512pxLink,
                count: ri.count,
              })),
              trader: { name: barter.trader.name, image: barter.trader.imageLink },
              requiredLevel: barter.level,
            };

            const category = categoryMap[rewardItem.item.category.name] || 'Other';
            categorized[category] = categorized[category] || [];
            categorized[category] = [...categorized[category], itemWithRequiredAndTrader];
          });
        });

        setCategorizedItems(categorized);

        // Process the traders' reset times data
        const traderResetTimes = traderData.traders.map(trader => ({
          name: trader.name,
          resetTime: trader.resetTime,
          image: trader.imageLink,
        }));

        setTraderTimer(traderResetTimes);

        // Process items and their trader prices
        const tradersItemsMap = {};

        itemsData.items.forEach(item => {
          item.traderPrices.forEach(traderPrice => {
            const traderName = traderPrice.trader.name;

            if (!tradersItemsMap[traderName]) {
              tradersItemsMap[traderName] = [];
            }

            tradersItemsMap[traderName].push({
              item: item.name,
              trader: traderName,
            });
          });
        });

        setItemsWithPrices(tradersItemsMap);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MyContext.Provider
      value={{
        categorizedItems,
        setCategorizedItems,
        imageColor,
        displayItems,
        setDisplayItems,
        traderTimer,
        itemsWithPrices, // Provide itemsWithPrices through context
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
