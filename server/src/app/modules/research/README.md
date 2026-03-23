# MB-101- API de Procesamiento de IA: 

-Diseñar e implementar el módulo en NestJS para recibir y procesar las consultas de investigación. 
Incluye configuración del cliente de IA y manejo de contexto.




Este modulo procesa los resultados de los juegos mediante IA con el objetivo de transformar los datos crudos de interaccion del estudiante en los juegos, en insights pedagogicos accionables.

Actua como un puente entre la interfaz de aprendizaje y los modelos de lenguaje, procesa los resultados de los juegos que ya han definido los otros chicos del team, para luego definir el arquetipo del niño.

-----------------------------------------------------------------

* Estoy implementando un sistema multimodal:

Ya que este nos permite analizar textos, analizar los contextos y me parecio lo mas escalable:

partiendo de la idea de que cada agente se adapte mejor a la naturaleza pedagogica de cada actividad.

 integrados hasta ahora:
 Gemini- https://aistudio.google.com/ -- sacar la API key y  pegarla en el .env

-------------------------------------------------------------------------------------------------

### Curl de prueba

El endpoint principal es un POST a api/research/process, se puede probar con un curl que debe contener: 

-id, gameType, gameInput (un objeto con los datos del juego original),
 studentResult (lo q el alumno hizo realmente)


curl -X POST http://localhost:3000/api/research/process \
-H "Content-Type: application/json" \
-d '{
  "studentId": "soperez-2026",
  "gameType": "read-aloud",
  "gameInput": {
    "text": "The quick brown fox jumps over the lazy dog"
  },
  "studentResult": {
    "content": "The quick brown fox jumps over the dog",
    "duration": 12,
    "success": false
  }
}'


### Respuesta esperada

El servidor respondera con un JSON que incluye:

-aiFeedback: con un analisis pedagogico detallado generado por Gemini 2.5

-dimensionUpdate: es el calculo de impacto en las dimensiones (logica, creatividad, etc.)

-perfformanceSummary: resumen de los datos tecnicos analizados.