import AtariIcon from './atari.png';
import GameboyIcon from './game-boy.png';
import GamecubeIcon from './gamecube-icon-36645.gif';
import NintendoSwitchIcon from './iconfinder_232_Nintendo_Switch_logo_4375016.png';
import NintendoDsIcon from './nintendo-ds.png';
import Ps2Icon from './ps2.png';
import Ps3Icon from './ps3.png';
import Ps4Icon from './ps4.png';
import PspIcon from './psp.png';
import SegaIcon from './sega.png';
import WiiUIcon from './wii-u.png';
import WiiIcon from './wii.png';
import XboxIcon from './Xbox .png';
import XboxOneIcon from './Xbox-One.png';
import SuperNintendoIcon from './Super-Nintendo-01.png';
import N64Icon from './n64.png';
import PCIcon from './pc-128x128.png';
import PlaystationIcon from './ps_playstation_logo.png';
import Xbox360Icon from './Xbox 360 Logo.png';
import MultiplayerIcon from './multiplayer.png';

import PhysicalIcon from './book-icon-139.png';
import DigitalIcon from './Library-Alt-icon.png';

import BlurayIcon from './icons8-blu-ray-120.png';
import DvdIcon from './icons8-dvd-logo-96.png';
import DiscIcon from './icons8-music-record-100.png';
import VideoFileIcon from './Movies-icon.png';

import SettingsIcon from './cogwheel.png';

// Interface
interface Icons {
    [key: string]: string;
}

export const icons: Icons = {
    settings: SettingsIcon
};

// Game System Icons
export const GameSystemIcons: Icons = {
    atari: AtariIcon,
    gameboy: GameboyIcon,
    nintendogamecube: GamecubeIcon,
    gamecube: GamecubeIcon,
    nintendoswitch: NintendoSwitchIcon,
    switch: NintendoSwitchIcon,
    nintendods: NintendoDsIcon,
    ds: NintendoDsIcon,
    nintendo64: N64Icon,
    n64: N64Icon,
    pc: PCIcon,
    steam: PCIcon,
    playstation: PlaystationIcon,
    ps1: PlaystationIcon,
    playstation2: Ps2Icon,
    ps2: Ps2Icon,
    playstation3: Ps3Icon,
    ps3: Ps3Icon,
    playstation4: Ps4Icon,
    ps4: Ps4Icon,
    playstationportable: PspIcon,
    psp: PspIcon,
    sega: SegaIcon,
    segagenesis: SegaIcon,
    supernintendo: SuperNintendoIcon,
    snes: SuperNintendoIcon,
    nintendowii: WiiIcon,
    wii: WiiIcon,
    nintendowiiu: WiiUIcon,
    wiiu: WiiUIcon,
    xbox: XboxIcon,
    xbox360: Xbox360Icon,
    xboxone: XboxOneIcon,
    multiplayer: MultiplayerIcon
};

// Book Icons
export const BookIcons: Icons = {
    physical: PhysicalIcon,
    digital: DigitalIcon
};

// Disc Icons
export const DiscIcons: Icons = {
    bd: BlurayIcon,
    sdbd: BlurayIcon,
    dvd: DvdIcon,
    hddvd: DvdIcon,
    ld: DiscIcon,
    digital: VideoFileIcon
};
