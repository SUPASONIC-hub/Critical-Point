import { paintAirport } from "./airport.jsx";
import { paintArchive } from "./archive.jsx";
import { paintAuditorium } from "./auditorium.jsx";
import { paintBookshop } from "./bookshop.jsx";
import { paintCafe } from "./cafe.jsx";
import { paintCallcenter } from "./callcenter.jsx";
import { paintChamber } from "./chamber.jsx";
import { paintCoast } from "./coast.jsx";
import { paintConstruction } from "./construction.jsx";
import { paintControl } from "./control.jsx";
import { paintCorridor } from "./corridor.jsx";
import { paintCounter } from "./counter.jsx";
import { paintCourtroom } from "./courtroom.jsx";
import { paintDesk } from "./desk.jsx";
import { paintFactory } from "./factory.jsx";
import { paintFloor } from "./floor.jsx";
import { paintGallery } from "./gallery.jsx";
import { paintHall } from "./hall.jsx";
import { paintLobby } from "./lobby.jsx";
import { paintMarket } from "./market.jsx";
import { paintMemorial } from "./memorial.jsx";
import { paintNewsroom } from "./newsroom.jsx";
import { paintOrchard } from "./orchard.jsx";
import { paintSchool } from "./school.jsx";
import { paintServer } from "./server.jsx";
import { paintSkyline } from "./skyline.jsx";
import { paintStreet } from "./street.jsx";
import { paintStudio } from "./studio.jsx";
import { paintTrading } from "./trading.jsx";
import { paintTransit } from "./transit.jsx";
import { paintWard } from "./ward.jsx";

/**
 * Which painter draws which room. The names are `PLATE_MOTIFS` in
 * `src/scenePlate.js`, in the order this table has always had.
 */
export const MOTIF_PAINTERS = {
  construction: paintConstruction,
  courtroom: paintCourtroom,
  airport: paintAirport,
  callcenter: paintCallcenter,
  studio: paintStudio,
  auditorium: paintAuditorium,
  server: paintServer,
  orchard: paintOrchard,
  trading: paintTrading,
  school: paintSchool,
  transit: paintTransit,
  bookshop: paintBookshop,
  cafe: paintCafe,
  ward: paintWard,
  lobby: paintLobby,
  coast: paintCoast,
  gallery: paintGallery,
  skyline: paintSkyline,
  street: paintStreet,
  floor: paintFloor,
  control: paintControl,
  archive: paintArchive,
  corridor: paintCorridor,
  hall: paintHall,
  chamber: paintChamber,
  newsroom: paintNewsroom,
  market: paintMarket,
  memorial: paintMemorial,
  factory: paintFactory,
  counter: paintCounter,
  desk: paintDesk,
};
