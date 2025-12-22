import React, { useState, useMemo, useEffect, useRef } from "react";
const initialUsers = [
  {
    username: "hana_leather_",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/448888238_1001810924949140_6233958131843663609_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=106&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MDMuQzMifQ%3D%3D&_nc_ohc=j1z9GH6yksoQ7kNvwElFI--&_nc_oc=Adm8MyNYV5iWNFiDhzN1q9B4bkj2WTPvZipkbgVuI-SpXffn9WMfmURiW4vZCT_15ac&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&oh=00_AfnS3SBx8vzcqb6L4mxw34M_9ThN7HLLymaWLL5UoU4yFg&oe=694F02ED",
  },
  {
    username: "fatemeh_mhmdi66",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.75761-19/498714633_17974531874828340_1628871214310269072_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=oqVl_yeAZncQ7kNvwGdwogV&_nc_oc=AdmQ3jmRS_o3Q-QyDFry1PZkBWsXcUKaV5ugy9oqNyD4M7d7LOvWBPutmcUu0dmv1pI&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=C-I7MXU2342i6YHljr8o-g&oh=00_Aflvk6zr3D_02DVvGojCNLluG-bDvcIs0nyCx-wypgAjXw&oe=694EEC6C",
  },
  {
    username: "sheyda14277",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.82787-19/587755246_17966212172996457_4469229289598694611_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=107&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=HTRIYsh39NoQ7kNvwGMAcxm&_nc_oc=Adn1CyZ8DDK50KDT3XKOamcxn7I8Y98M5tptdPPeiGG5w-Q_xWoBtrhfqXCxDX5D_0g&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=QZhLRuIHm4KoxA5uEC5M_A&oh=00_AfmMq_dwrDj7UR5v3U9Lk6g4-XczxP1KGzaLancY0FAsZA&oe=694EF1BC",
  },
  {
    username: "charm_deylam",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/41969355_484839338666331_2330524837644075008_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy44MDEuQzMifQ%3D%3D&_nc_ohc=paEWnKcdjuEQ7kNvwEJeE0C&_nc_oc=Adlz191kUIEd0ggW1xc-a-HkDsifxaIjxnTbpBUlmO2zjyOE--xegwKgc2rpsNFV9pw&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_Afn_7x8LFazDYSmJesWnqMehRpRQNFdA0_B9fsie2HR2KA&oe=694F0124",
  },
  {
    username: "charmreyhaneh",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/540437325_18048604982646200_5632508098873099698_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=106&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=i9clrq6gfakQ7kNvwFDnPfK&_nc_oc=Adlcz1i9HqOjBCDxwp6VnoY8GgnoTLgebhXk8XVeSDgzACWa7Yy8Rp3iGCCfOScJplg&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=WhL7nzQhdrQsI89Vl7hK0A&oh=00_AfnzDGl_chS2McpreI2dH1zjEmGgptjul8cDfvW3BjxL9w&oe=694F1911",
  },
  {
    username: "gh_z20212",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/488266095_1894542897985838_6896937461085329542_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=107&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=b2hAQx5RRBMQ7kNvwFk7jSL&_nc_oc=AdnSuMU_DGWYvQAki4D3i1DanhIlHrSO_zfM2FOAmH-6lIkxu9QEuNrHddcsXYRPHz8&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_AfmtEcq6wGqyjF9U7JZHk5R9XBPRAvzdpMbolhFUsUSmEg&oe=694F0297",
  },
  {
    username: "anashid_leather",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.82787-19/525341911_18042683423649012_6999978209680666743_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=q8HNLWwVJZsQ7kNvwG0MBdc&_nc_oc=AdmQIYXRLYW9RVlDtGFUEwH3TDQxKUp0CHbtpImItx-71f3FEfB7SLze4oOq5yzNxiE&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=C-I7MXU2342i6YHljr8o-g&oh=00_Afnq-XnBE-RRxs8gjghKKCVB7-yM3C2sB0AEopTCsvFHug&oe=694EF34A",
  },
  {
    username: "mehr_.leather",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/271952757_328450275777479_4133060545056540753_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy40MTcuQzMifQ%3D%3D&_nc_ohc=xnK-4DiGIIsQ7kNvwHC62Zy&_nc_oc=AdktfsCZhR1bGjIwqqhlI9gWWCAio3Qi9UpBkMtoNCYzGvji91aPQ6kXqRjfSPZ6hXg&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_Afl_qvna6pFhMqXo3X-fQ12Dgbh76jasNlV5lzQA8qO3oA&oe=694EDFEB",
  },
  {
    username: "leva_leather",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/515161945_18363667297145960_1161321163550994574_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=103&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MDYuQzMifQ%3D%3D&_nc_ohc=xsWiGcMq28gQ7kNvwHHcUQo&_nc_oc=AdldQSDla0RzIADSO1qL7uL0NTIvrIAh5gVoNaHe3iKVUb41Y4RlJDYxj0npq5pyt3Q&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=C-I7MXU2342i6YHljr8o-g&oh=00_AflWeyaDS0QjjRWVNx6YVohgyiZhWnLQdZyTIgPxzhrVBg&oe=694F10C0",
  },
  {
    username: "avrin_leather",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/370631810_893280402400396_4690420602425792624_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDE3LkMzIn0%3D&_nc_ohc=1WCmCGiA0NgQ7kNvwHrNMX7&_nc_oc=Adn3jS3qoCkQb4dVN9-qwcBcyhZnCtB-04cjGlqLO60AqwuhqoH047OYjoIoJXeoQg4&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_Afk2ULUDtSdawCgFt-k1jCBiyzN5gFqieYlg0Zl_FIGFPA&oe=694EF775",
  },
  {
    username: "sh.shahsiah",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/457496451_1885467861933867_347559789344532081_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=VjmVfZQrdtQQ7kNvwEhElw2&_nc_oc=AdkXtt9pWmhktYFbD3ydgoSIZUDbwCVl8GAq3NqH1pH8qJHsAN5qVjiAR7OK6zmPOFI&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_AfnvOcHdSxMN_7pQTmUh-SJa8hJU6P6kh_ShJ0VuVSgsNw&oe=694EFD92",
  },
  {
    username: "khatereh_hjh",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.82787-19/584401736_18516646618070322_8124392470208501146_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=107&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDA5LkMzIn0%3D&_nc_ohc=gxz1bHJEoF8Q7kNvwFOvKOD&_nc_oc=Adke6mRktylB8uPEeYjXoKcFy-UlnGOLObIY72Cyq5uAYnAbbnKf2dbPxvksQAeLsEc&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=h8LctzhCrkN8S1nht_y-4Q&oh=00_Afk5y0_NfV4BshD2joLUT21DKAFL267Yf1O9JKAXOtrjcA&oe=694EE0B7",
  },
  {
    username: "charmkade_mahi",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/464212644_1059024022533287_7081422868826212537_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=AkO3KgiF8B0Q7kNvwGt238k&_nc_oc=AdlAJR03V2eZ_TZumuU4DTWyJaAP0l6Xjzmvu5s__FmKBV_CH6XJhsygGqSnz8w7wYI&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_AfnbogXp8rdSURezVq7z2JYedF4y5xWoBQKv0BCGkfbx9A&oe=694EEDE3",
  },
  {
    username: "damas_leather",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/445778269_984403273299700_1815338797120178913_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=109&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=KqU6Ye-d9yYQ7kNvwGRZstE&_nc_oc=AdmjRcHrQDx7WvjJ-PyTYqYF4srzNsbNP43ShfBCukRmio4R6cfE_UUIuJgB_QtI_as&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_AfnMejJ5JzqXcY0vxIHm7AlwKLZCE5Ac9iyDDSKUyiqs-A&oe=694EE710",
  },
  {
    username: "masiha_leather",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/441074046_1093328091743408_8639965705127082112_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=103&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=qNBP05jewSIQ7kNvwHLl-m_&_nc_oc=AdnpYL5N_S30Mg46IaXb3Bei-sscy-31W84WxQlMRH27DED6n4RYDwYsanI_hqXhT0Q&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&oh=00_AfmmeqcnLBBDZmUhPQ_kDByhbwPaodTNHN4Cnsiw7gEMvQ&oe=694EF8A1",
  },
  {
    username: "sortikleather",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/304904219_1146425669620286_2311177066386973705_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=102&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=IPA1AoP8VKgQ7kNvwHcxTNu&_nc_oc=Adm_QTpsgWrJlerNoiTJ7N_qKnJhCoFFK3Ee6g-s9KWpwiAt4qFA_Ss4torjkQTcbqY&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_Afl3By6dNksp_Q7DPFnuZrZI_qi8x469cavtFiPHynHeuw&oe=694F0667",
  },
  {
    username: "ensiyehabazari",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/441368934_1110035986947818_8459720285284162713_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=109&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=U1TUjoUaFPsQ7kNvwEHiUnS&_nc_oc=AdmgEF2xbU1c1Yhm-6gOW9yJ5wV1q9KI24aYy_p4uCZSwRey8gbjcjW0PAHs-bR9cY8&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_AflE-FOx0vGKB6V5GfkFe3dll0KZOJfEX6Bn9RYqXfrZgg&oe=694F0B8F",
  },
  {
    username: "hanniartmiss",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/487393059_988021886776128_135508830906493182_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=t8OO-nCf20sQ7kNvwHGuR5V&_nc_oc=AdmmSKC1YBYItsJtFg8cyNzEtlWcFgyL435JgHxtC4R_irNk60wCC0Bxd6ZBPDWFNQA&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_AflDVk11HYmWZwzgfwHT0Cnr-VbWDZg3jDObMowq-Y6-FQ&oe=694EDD60",
  },
  {
    username: "charm._paradise",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/367538860_334918248887834_2821040444467572808_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=101&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45ODYuQzMifQ%3D%3D&_nc_ohc=s_8eGum7o2wQ7kNvwF71I76&_nc_oc=Adn8xsDttsgOitCFb9H2PSKJemrYjo0V_gVaZ7m-mNVrKAvMYg4QRLk7SIU5SqUp_jM&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&oh=00_AflNuPNtQUDajSvZRq7rW2BOnWqziSsVomRgYn85gzrrBg&oe=694F1101",
  },
  {
    username: "anamae1983",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/332112334_915584996425967_6649534254003014878_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MjAuQzMifQ%3D%3D&_nc_ohc=47OWUQgG9qIQ7kNvwGpMdE4&_nc_oc=AdkTgC9cmxjrVd-7hxn54wTkvsasOV0A1AeyL9k7DPLVsB7F7Fq_SryhC0rV0RSLh8s&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_AfmYigcuDkYQsAN55ui6KmE7LEt1643s2Dr-A2vUxh9uvw&oe=694F103D",
  },
  {
    username: "srahemi66",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/240944749_2170304419943762_5556193687031757503_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=107&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy44MDguQzMifQ%3D%3D&_nc_ohc=KDS6xBFuoyQQ7kNvwHyQu2_&_nc_oc=AdmmsIEvRkh8QahMcKW-MuE-3Xqs9yQL79nHwL4jmWygpZbmB0o-MmQcJDXMyWEQoMA&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_Afk8hIvBukvsjppKA_-2sLASXTt1iHrMoSBUdA9NW-Khzg&oe=694EF9FB",
  },
  {
    username: "farzaneh.bayati2023",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/404600865_295485093460366_3423041791793002269_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=109&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=rabpL4km6YgQ7kNvwHEvl9f&_nc_oc=AdktOjhjxygWOVMjhZpoI03HAQodc9lXnBV9bfnK1q-aLOxf-n4B9lULH36XZ-75hdg&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_Afl-PizdtCK934zKX2v3t_42bUAdkoW_oiBJRM4QhEgCCQ&oe=694F119F",
  },
  {
    username: "sanaz__charm",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.82787-19/598810225_18053118131653324_1195142670421870575_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=104&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=q32bkGgiFiAQ7kNvwGKZSPi&_nc_oc=Adkqd_PJ8PQ4Wz7TRwatpcUYk2ryT8_xNqDGfmqp87WM9gYvuLqwfh0ErcMKZ5VImMo&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&_nc_gid=PMqgV4RyU6uuIJNP049llg&oh=00_AfmLfKM4KmDPBhQsqYv8Jw0v5amPPGmYvS_8fLvCt4zhWg&oe=694EF6AB",
  },
  {
    username: "kh_yazdanii",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/538275725_18080860291928474_7892291521749348297_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=103&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=CfLuF4qjyJ0Q7kNvwER3Hgg&_nc_oc=AdmCPco3wABZa00FbDjVX7c_RXf9LHe3zrvMr5GxOt-taGg551pFy-3lubePmIf7xrk&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=QZhLRuIHm4KoxA5uEC5M_A&oh=00_Afmii3AYxGmhOiO7YMEQHeaWvhRdg0HjI40HfYfWDKNGkw&oe=694EF60A",
  },
  {
    username: "akram.ghanbari95",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.75761-19/504245346_18389574157136399_3222631873623455889_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=104&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=8pvy8KDBUhoQ7kNvwFcL0jS&_nc_oc=AdnCMwev5NajRijfo8dy_aw1kOW3u0xq79rRHN_oso8hK7WQvRgw-3D9JhQPdHJgNjs&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&_nc_gid=UFugOoFnqg-3sAY9swJrNw&oh=00_AfmzLQkv7YoP0JXyu_S8Z9fjjblhwx22savNLJ1QZrnnVw&oe=694EF03C",
  },
  {
    username: "sahar_hedayatt",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/293676477_446487757324727_7834801636451569095_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=109&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MTAuQzMifQ%3D%3D&_nc_ohc=ycXjTWVhWloQ7kNvwGfWe5m&_nc_oc=Adnb8xjoJy5ZUwK6w_IDsRy0gZWUse6EFSFQNb7yrZ-KfRgk_3wMFZoHzj5-JJ0CFJU&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_AfnzBWeGiZoZIIXFYgeaIVVsm8kprVQXlSyB-rzqiAS9-A&oe=694F1313",
  },
  {
    username: "sal_leather",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/280763249_392203089455867_6397813095149024435_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=7q4FFB3EvaEQ7kNvwFTbxQT&_nc_oc=AdmrxJExkXkyIqX7zbniJtKpXYRMRJ_OjM7SyFL9eiclSoJ7-YqNe7SkNeOmthNTdT8&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_AfkyyctdeWfHuRn1P_IBAAQIx_mtuRM1Q5c0W6l647aQuA&oe=694F00D4",
  },
  {
    username: "vidahatami67",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.82787-19/589865498_17931005988149067_8497255813187923402_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=sReGVR5IbO8Q7kNvwG4lgbB&_nc_oc=Adko9Jg9LEuvak_-rR73LCW75KJ_Hq3LwofZ3LW9DNNh_N-xFCIdB-HSlnkpuIkaljg&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=ZPAe-xSgr4fMGuBcYWx2og&oh=00_Afk9l1-Rj1IWgq3lcFLVZR4sVL3TG-QYjEqYQA6rk9GssQ&oe=694F126C",
  },
  {
    username: "samiramohammadi1967",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/340297598_242964471435603_2205793543075344618_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=104&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4zNTcuQzMifQ%3D%3D&_nc_ohc=lHvTldCOSOMQ7kNvwFW6189&_nc_oc=Adms6_g8rmgHAbzFJuAd1lxsPBMwjCTkMmH7mGIBKCBtehwoKbjO4a8TibIRTv3u_F8&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_Afn7CXYSCzkSdZL8F4ozGwZXeTDuxPfgi8qegqwuLys_3A&oe=694F06FE",
  },
  {
    username: "zahra13620701",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.82787-19/588484601_18084747161512578_7899733995284029162_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=t7lgTivLneIQ7kNvwGAxYVO&_nc_oc=Admnl65soWBWCPVJSPGuPff613UGmMVj7oHUFTDc4VO8-_43GBptXv3BDzQkj9ISKDU&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_gid=NoBRoqDiixNVKa3mQZes1Q&oh=00_Afl8CQ5nf1EdrhbEQRlCm9bZoXrRSr_xfhwpwSnOgPAdVQ&oe=694F036C",
  },
  {
    username: "banosharghi_",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/274091518_627845398296194_2995652401664231331_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=101&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDAwLkMzIn0%3D&_nc_ohc=PceYFv_PzgcQ7kNvwHK_9Nf&_nc_oc=AdkCtCCQIEp64KqrXWxZJ8I0MIYVaYGejA4b7cbJkWAKU8JXgkxFBHVwLrXJKl8ZAGw&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&oh=00_AfmONXpGVQxn6BPdwcvDmSuuH2eGfVdksImnniUNW7aAOg&oe=694F0B39",
  },
  {
    username: "tak.charm2020",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/366148935_1485628565519392_5276120146717680823_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy41NDUuQzMifQ%3D%3D&_nc_ohc=-bFISul1rrYQ7kNvwHjU98r&_nc_oc=AdmjhUhach3C-hAd0Iz6ZKmI385bGw0L6HBm7CBHqjwoiylewqRjoMB8Ykpwwqapy9o&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_AfnLl7AIB17p8a5K4xyLn43ur5-ucacw0a1IIbZ7Hh3UFQ&oe=694F02F2",
  },
  {
    username: "zahra_farokhy70",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/455872367_3865887693690998_2952969715603647188_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=105&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=-RQoC6ZBBMQQ7kNvwGwHqrV&_nc_oc=Adkl-MR3QjfNMUDSZdGa6VQkWi6mdBTppUXNvv_agc04IPRcj5nmWxWDUuNpcqouDCk&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_Afm3vbmy5zIoh55cH4GocYQEMnbXlHHfKYAGlKbdup8oiw&oe=694F0201",
  },
  {
    username: "set_charmtak",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/296525506_1299318080875401_2641482361886959197_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=105&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=GFC33G19YbAQ7kNvwFGrdEj&_nc_oc=AdkL_ainyYbUgMbzVwz_BgjvIfJAqA9GDfocOqjKafNu7dS_BfiGxXm5FYaXM3wEwa0&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_Afm7UFeTAHzKKMBLHB3MO6rprOd-GuaBBUOUvenGkZ1Jvg&oe=694F1165",
  },
  {
    username: "mthre.naseri",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.2885-19/42002950_1882119075215048_7773502063975071744_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=9fPOP-g-nSUQ7kNvwGHAOIt&_nc_oc=AdkLHuuoYkU1d8kB2DrE8HHmm-X0hEfbJ5zp4Sodzsyjh_yQMfIQuoCj6uRBzSRx0ms&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&oh=00_Afl6ouPzeFux35107P325Gy96vg6n0ClMelgd14PuY6rFw&oe=694EE53A",
  },
  {
    username: "vestacharmm",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/574028881_18046387679688426_8472458262853853241_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=103&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45NTguQzMifQ%3D%3D&_nc_ohc=rBVl_Ah8-tsQ7kNvwEzeKkg&_nc_oc=Admt2hh-1NgpvDFstlKQQwjOOajEHstrwhG8mf52y4oKL4ZShl6Ndm_qM4NEvugaTm0&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=ZPAe-xSgr4fMGuBcYWx2og&oh=00_Afl-vaSdEStG9YX17AbE2yFCk_jaXYCDYuJ7pZJyQZWPZw&oe=694F0A1A",
  },
  {
    username: "paarseh.leather",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.82787-19/588018506_18089762911966971_5727413888696481010_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDI0LkMzIn0%3D&_nc_ohc=PkIoZF8YE68Q7kNvwFLbSYA&_nc_oc=AdmA66o85Xu2VYD5VRHvJ4djFNXMG7tzrbM9i3fxjmwKMVdoTt7GFEcQU9ekc9obvIk&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&_nc_gid=WhL7nzQhdrQsI89Vl7hK0A&oh=00_Afk_VTDo7cg1Gt8F3fSdUIR4hcv5bJNuLNLsjVOzECPr9g&oe=694EEB6D",
  },
  {
    username: "sarcoline__",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/418352757_1315630099835230_1038090005628389195_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=105&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy40MDEuQzMifQ%3D%3D&_nc_ohc=c-ugaXeGvOAQ7kNvwGvNqgU&_nc_oc=AdlJfr3LCbiHn7lVKhw6_5U5NxbwR1s8WjSR9InsCOBcoTuQ54-D3fKvt8gXFs1q-P0&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_Afl8Ua40M-UHPp7Ltsrl0a2-vUF1DbjOp9DdVT0POAayyg&oe=694F03B4",
  },
  {
    username: "mitra.leather",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/412738753_379166424770436_5047749946745847698_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby45NDguYzIifQ&_nc_ht=scontent-lhr6-2.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2QEuCcC4HSJwp6SzKakKFDWiUuKmlyoE2d8lAKGQPG1OhmNCFaI8NNTc8101Vwaga8w&_nc_ohc=8ywsO_MqinwQ7kNvwExAw_d&_nc_gid=dEQ58ntF4ufBkKwYUv3S5w&edm=AA5fTDYBAAAA&ccb=7-5&oh=00_AflZd1XHgi70MdSfS7zIy4ph1FeIUFKQgiJl8gzvlS5TDQ&oe=694EEFEC&_nc_sid=7edfe2",
  },
  {
    username: "roja.charm",
    profileImage:
      "https://scontent-lhr6-1.cdninstagram.com/v/t51.82787-19/582330249_18070989551358145_7150606789738058763_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=109&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=bZW0NSmKWnwQ7kNvwFz7HjZ&_nc_oc=AdnVBkp-u2l6hen3S1CXPoEu4rpp0uNPzplfXpMW9NWzIU3n69RYJMsPd7xDL30nJhE&_nc_zt=24&_nc_ht=scontent-lhr6-1.cdninstagram.com&_nc_gid=_BzDnohyVCY6JawgG_JjzA&oh=00_AflgjGS-m-5pwbjtdjH24XMewcnXq5T3CM59u73_oIJldQ&oe=694F0014",
  },
  {
    username: "charm_raana",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/458392933_502290982406019_5111902981408796726_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45MzcuQzMifQ%3D%3D&_nc_ohc=sHvF0EowNu8Q7kNvwHsywGN&_nc_oc=AdkwNrvIBAJLiAZ4QE3w6oFdWzAQjSarips96RKlUKSyO-E51pKCtfE6GuyG2osJVC8&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_AfmUzgLfp90FMV5vnX-9GlJ_oKo53NPKzyQNWHw6hxDyBQ&oe=694EE93B",
  },

  {
    username: "charm_novin2024",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.2885-19/471530983_1748764629234730_4957069460361834962_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=106&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=-bFU9Ypqqp0Q7kNvwGRaRyf&_nc_oc=AdmZJlQpXvaGENRaC_PlSZBZVxuJ-UKxFKUAyd8dPlwky29cellu6mlf-UltLmFs-to&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&oh=00_AflIBhrmpxGzZaiqFBOikQoTJ5qZYFYkWEaAZngSbe_zAQ&oe=694F160D",
  },
  {
    username: "beni.m.neshat",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/434757191_1414181049463339_8746124667913261015_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MDAuQzMifQ%3D%3D&_nc_ohc=dl7PfPn96g8Q7kNvwEntTWI&_nc_oc=AdkUm4ZwAt84tV-P-HYvfGzLucfSi7I9mZxkx4xq4x-HnvvO_uffwBmNZXycyI2vsKo&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_Afm6mYVUQipxxxhtO52AJNiNvDjQgcNbz1O_EKC3BcM50g&oe=694EF7D5",
  },
  {
    username: "mohad.h90",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/575588566_18537660253059139_1992337961656503726_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=106&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Cuu24InopmgQ7kNvwEFccqr&_nc_oc=AdmuY8bRaUefNESogDig-vM_1uBxEYkzGf4Ux2LEqNKU-mgdWjFWpuyb9_VT-uQmMfA&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=WhL7nzQhdrQsI89Vl7hK0A&oh=00_AfkP0IHhwZUZUf3k1NoyEVNBna6P0LDL7_hiZtlxasdUPQ&oe=694EF2A1",
  },
  {
    username: "sadaf.sadra_salemi",
    profileImage:
      "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-19/481030996_1711043092807855_6011794058759789464_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=PgWh8c3WJScQ7kNvwGfC4O5&_nc_oc=AdmDmQFn2RTAksKk1b5-FrhPskFFPSPP7q_u9cmGpah6e23eIwfL9GsNQUhFa0fPcpI&_nc_zt=24&_nc_ht=scontent-lhr8-1.cdninstagram.com&oh=00_AfldlDYfqByqxRVZTZp6q1S_nZnECMUDdGJBkEC2Szyblw&oe=694F011C",
  },
  {
    username: "seviira_collection",
    profileImage:
      "https://scontent-lhr8-2.cdninstagram.com/v/t51.82787-19/515255973_17850827358490581_3627235190456063623_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=103&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Xv7Zs9WYneYQ7kNvwHHtwX2&_nc_oc=AdnFBWFEf84JoTWcFT5Dz68WS6El2fVuwH4QnmX_jBv65iAm215K-dsgBBW9lMr8J6o&_nc_zt=24&_nc_ht=scontent-lhr8-2.cdninstagram.com&_nc_gid=PVM-RvEi9uJY7JJF9eEPxg&oh=00_Afli2kZf31H4BxoeQZ0idtZQiQpgP9P8099G6cnsPUIEWQ&oe=694F04E4",
  },
  {
    username: "shohrh.ghasemi",
    profileImage:
      "https://scontent-lhr6-2.cdninstagram.com/v/t51.2885-19/455702464_1553835552200169_3692938523450274961_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=105&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy43MzIuQzMifQ%3D%3D&_nc_ohc=XofyvbFunS8Q7kNvwE7wfc9&_nc_oc=AdmLhmlqFp_sg0xO6_ThBsQh3WWVLFhqxrg58wNDLyTIAs72v3_Oc9Bkwf46EJTyRzQ&_nc_zt=24&_nc_ht=scontent-lhr6-2.cdninstagram.com&oh=00_Afls-JG2U19BiWQb9wPG_tEAjf8NIgBTv4ATehqh3fReBQ&oe=694EE9DC",
  },
];

// --- Configuration ---
const ITEM_WIDTH = 140;
const SPIN_TIME = 4000;
const REPETITIONS = 5; // List repeats to ensure there's enough "track" to spin

export default function InstagramRandomPicker() {
  const [users, setUsers] = useState(initialUsers);
  const [selected, setSelected] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [winner, setWinner] = useState(null);
  const containerRef = useRef(null);

  // Creates the long "ribbon"
  const longUserList = useMemo(() => {
    if (users.length === 0) return [];
    let list = [];
    for (let i = 0; i < REPETITIONS; i++) {
      list = [...list, ...users];
    }
    return list;
  }, [users]);

  const spin = () => {
    if (isSpinning || users.length === 0) return;

    setTranslateX(0); // Reset position
    setWinner(null);
    setIsSpinning(true);

    const winnerIndex = Math.floor(Math.random() * users.length);
    const winnerUser = users[winnerIndex];

    // MATH EXPLAINED:
    // 1. We want to land on the winner in the 12th repetition (to give it speed)
    const landingRepetition = REPETITIONS - 3;
    const totalItemsToSkip = landingRepetition * users.length + winnerIndex;

    // 2. Distance = Items * Width
    const distance = totalItemsToSkip * ITEM_WIDTH;

    // 3. To center the item, we calculate the container midpoint
    const containerMidPoint = containerRef.current.offsetWidth / 2;
    const itemMidPoint = ITEM_WIDTH / 2;

    // Final position = move distance, then adjust so the item center hits the container center
    const finalPosition = distance - (containerMidPoint - itemMidPoint);

    setTimeout(() => {
      setTranslateX(finalPosition);
    }, 50);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner({ user: winnerUser, index: winnerIndex });
    }, SPIN_TIME + 100);
  };

  const confirmWinner = () => {
    if (!winner) return;
    setSelected((prev) => [winner.user, ...prev]);
    setUsers((prev) => prev.filter((_, i) => i !== winner.index));
    setWinner(null);
    setTranslateX(0);
  };

  return (
    <div className="font-VazirMatn max-w-4xl mx-auto px-6 py-10" dir="rtl">
      <h2 className="text-3xl font-black text-center mb-8 text-gray-800 font-sans">
        گردونه شانس ایده پارسه
      </h2>

      {/* Viewport: Forced to LTR so the animation math is consistent */}
      <div
        ref={containerRef}
        dir="ltr"
        className="relative overflow-hidden h-48 bg-gray-50 border-y-2 border-gray-200 shadow-inner mb-10 flex items-center"
      >
        {/* Fixed Center Indicator */}
        <div className="absolute z-20 left-1/2 -translate-x-1/2 top-0 h-full w-1  pointer-events-none ">
          <div className="absolute -top-1 -left-2 w-5 h-5 bg-red-600 rotate-45"></div>
          <div className="absolute -bottom-1 -left-2 w-5 h-5 bg-red-600 rotate-45"></div>
        </div>

        {/* The Sliding Ribbon */}
        <div
          className="flex items-center"
          style={{
            transform: `translateX(-${translateX}px)`,
            transition: isSpinning
              ? `transform ${SPIN_TIME}ms cubic-bezier(0.15, 0, 0.15, 1)`
              : "none",
            willChange: "transform",
          }}
        >
          {longUserList.map((user, i) => (
            <div
              key={`${user.id}-${i}`}
              className="flex-shrink-0 flex flex-col items-center justify-center"
              style={{ width: `${ITEM_WIDTH}px` }}
            >
              <div
                className={`w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-700 ${
                  winner?.user === user && !isSpinning
                    ? "border-green-500 scale-110 shadow-lg"
                    : "border-white shadow-sm opacity-60 scale-90"
                }`}
              >
                <img
                  src={user.profileImage}
                  className="w-full h-full object-cover grayscale-[30%]"
                  alt=""
                />
              </div>
              <span
                className={`text-xs mt-3 font-bold  font-mono ${
                  winner?.user === user && !isSpinning
                    ? " scale-125 text-green-800 "
                    : "text-gray-500"
                }`}
              >
                @{user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {!winner ? (
          <button
            onClick={spin}
            disabled={isSpinning || users.length === 0}
            className="px-12 py-4 bg-sky-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-gray-800 transition-all disabled:opacity-30"
          >
            {isSpinning ? "در حال قرعه‌کشی..." : "شروع چرخش گردونه"}
          </button>
        ) : (
          <button
            onClick={confirmWinner}
            className="px-12 py-4 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg animate-bounce"
          >
            ثبت برنده: @{winner.user.username}
          </button>
        )}

        <button
          onClick={() => {
            setUsers(initialUsers);
            setTranslateX(0);
            setWinner(null);
            setSelected([]);
          }}
          className="text-gray-400 hover:text-red-500 text-sm underline"
        >
          ریست
        </button>
      </div>

      {/* Winner List */}
      {selected.length > 0 && (
        <div className="mt-5 border-t pt-10">
          <h3 className="text-xl font-bold mb-6 text-gray-700">
            🏆 لیست برندگان
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {selected.map((u, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center  gap-3 bg-white p-3 rounded-2xl border border-green-100 shadow-sm"
              >
                <img
                  src={u.profileImage}
                  className="w-15 h-15 rounded-full border-2 border-green-400"
                  alt=""
                />
                <span className=" font-bold text-gray-800">@{u.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
