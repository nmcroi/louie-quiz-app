# Vragen genereren voor Spelenderwijs

Dit script zet Excel/CSV bestanden om naar JSON-vragen voor de Spelenderwijs quiz app.

## Vereisten

```bash
pip install openpyxl
```

## Excel/CSV formaat

Maak een spreadsheet met deze kolommen:

- `vraag`: De vraagtekst
- `antwoord`: Het juiste antwoord
- `opties`: Komma-gescheiden lijst van antwoordopties (alleen voor meerkeuzevragen)
- `plaatje`: Bestandsnaam van de afbeelding (optioneel)
- `moeilijk`: Moeilijkheidsgraad (1-3, optioneel, standaard 1)

## Gebruik

```bash
# Voor groep 2 (6-jarigen)
python generate_quiz.py vragen.xlsx groep=2 > ../public/data/groep2.json

# Voor groep 5 (10-jarigen)
python generate_quiz.py vragen.xlsx groep=5 > ../public/data/groep5.json
```

## Tips

- Plaatjes moeten in `public/images/` staan
- Gebruik eenvoudige bestandsnamen voor plaatjes (bijv. `kat.png`)
- Test de JSON altijd even in de app voordat je veel vragen toevoegt 