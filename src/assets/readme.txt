Dane znajdują się w dwóch plikach: medical_data.csv oraz mortality_data.csv

medical_data.csv:

SEQN - numer identyfikacyjny badanego
RIAGENDR - płeć (1-mężczyzna, 2-kobieta)
RIDAGEYR - wiek w latach
DMDHHSIZ - wielkość gospodarstwa domowego (1 do 7)
DMDMARTL - stan cywilny (1-zamężna/żonaty, 2 wdowa/wdowiec, 3-rozwiedziony, 4-w separacji, 5-nie zamężna/ nie żonaty, 6-żyjący z partnerem)
BMXBMI - BMI
BMXWT - waga (kg)
BMXHT - wysokość (cm)
LBXWBCSI - leukocyty (WBC (SI))
LBXHGB - hemoglobina (g/dL)
ALQ110  - co najmniej 12 drinków w ciągu roku (1-tak, 2-nie). Drink to odpowiednik 25ml spirytusu.
SMQ040 - palący (1-tak, 2-nie)
LBDHDL - HDL-Cholesterol (mg/dL)
LBTC - LDL-Cholesterol (mg/dL)
LBTR - Trójglicerydy (mg/dL)
LBLDL - LDL-Cholesterol (mg/dL)
BPXSY - ciśnienie skurczowe krwi
BPXDI - ciśnienie roskurkowe krwi
CARDIO - choroba wieńcowa (1-tak, 2-nie)


mortality_data.csv:

seqn - numer identyfikacyjny badanego
mortstat - informacja o tym, czy pacjent żyje (0-żyje, 1-nie żyje)
permth_int - ilość miesięcy od badania. Wyniki badania znajdują się w medical_data.csv
