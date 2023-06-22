import { ReactComponent as SheepIcon } from "../assets/resources_icons/sheep.svg";
import { ReactComponent as WoodIcon } from "../assets/resources_icons/wood.svg";
import { ReactComponent as WheatIcon } from "../assets/resources_icons/wheat.svg";
import { ReactComponent as ClayIcon } from "../assets/resources_icons/clay.svg";
import { ReactComponent as RocksIcon } from "../assets/resources_icons/rocks.svg";
import { ReactComponent as TownIcon } from "../assets/resources_icons/town.svg" 
import { ReactComponent as CityIcon } from "../assets/resources_icons/city.svg" 
import { ReactComponent as RoadIcon } from "../assets/resources_icons/road.svg" 
import { ReactComponent as DevelopmentIcon } from "../assets/resources_icons/development.svg" 
import BackpackIcon from "@mui/icons-material/Backpack";
import ConstructionIcon from "@mui/icons-material/Construction";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const inventory = [
  {
    name: "sheep",
    icon: SheepIcon,
  },
  {
    name: "wood",
    icon: WoodIcon,
  },
  {
    name: "wheat",
    icon: WheatIcon,
  },
  {
    name: "clay",
    icon: ClayIcon,
  },
  {
    name: "rocks",
    icon: RocksIcon,
  },
];

const crafting = [
  {
    name: "town",
    icon: TownIcon
  },
  {
    name: "city",
    icon: CityIcon
  },
  {
    name: "road",
    icon: RoadIcon
  },
  {
    name: "development",
    icon: DevelopmentIcon
  },
]

const menus = [
  {
    id: "build_menu",
    title: "Crafting",
    buttonIcon: (
      <ConstructionIcon
        sx={{
          fontSize: "4vmin",
        }}
      />
    ),
    color: "success",
    disabled: false,
    items: {
      town: 0,
      city: 0,
      road: 0,
      development: 0,
    },
  },
  {
    id: "inventory_menu",
    title: "Inventario",
    buttonIcon: (
      <BackpackIcon
        sx={{
          fontSize: "4vmin",
        }}
      />
    ),
    color: "warning",
    disabled: false,
    items: {
      sheep: 0,
      wood: 0,
      wheat: 0,
      clay: 0,
      rocks: 0,
    },
  },
  {
    id: "trade_menu",
    title: "Scambi",
    buttonIcon: (
      <CurrencyExchangeIcon
        sx={{
          fontSize: "4vmin",
        }}
      />
    ),
    color: "error",
    disabled: true,
  },
]

export {
  crafting,
  inventory,
  menus,
  SheepIcon,
  WoodIcon,
  WheatIcon,
  ClayIcon,
  RocksIcon,
  TownIcon,
  CityIcon,
  RoadIcon,
  DevelopmentIcon
}