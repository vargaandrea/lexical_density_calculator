**Lexical diversity**
----
  Returns json data.

* **URL**

  /complexity

* **Method:**

  `GET`
  
*  **URL Params**

   **optional:**
 
   `method=verbose`

* **Body**

  `input_text=[text]`

* **Success Response:**

  * **Content:** `{  data { overall_ld: 66.67 } }`

  OR for method=verbose
  
  * **Content:** `{  data { overall_ld: 66.67, sentence_ld: [60.00, 72.35] } }`
 
* **Error Response:**

  * **Content:** `{  error: 'Input text missing'}`

  OR

  * **Content:** `{  error: 'Input text is too long'}`
  
  OR

  * **Content:** `{  error: 'Input text has too many words'}`
  
  

* **Sample Call:**
 
  * See: lib/request_complexity.js
 
