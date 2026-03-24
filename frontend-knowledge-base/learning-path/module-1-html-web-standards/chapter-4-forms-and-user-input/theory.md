# Chapter 4: Forms and User Input

## 1. Why Forms Matter
Forms are one of the most important parts of HTML because they allow users to send information to a system.

Without forms, users can read content, but they cannot easily interact with an application. In real projects, forms are used for:

- logging in,
- creating accounts,
- searching,
- sending messages,
- uploading files,
- filtering products,
- completing surveys,
- making payments,
- editing profile settings.

Forms are important because they connect frontend structure with backend processing. A form is often the first place where you see how user input moves from the browser to a server.

## 2. The `<form>` Element
The `<form>` element groups controls that collect and submit user data.

Basic example:

```html
<form action="/submit" method="post">
	<label for="full-name">Full name</label>
	<input id="full-name" name="fullName" type="text">

	<button type="submit">Send</button>
</form>
```

### Main Attributes of `<form>`

| Attribute | Purpose |
|-----------|---------|
| `action` | The URL where form data is sent |
| `method` | The HTTP method used to send data, usually `get` or `post` |
| `autocomplete` | Helps browsers suggest previously entered values |
| `novalidate` | Disables built-in browser validation |
| `enctype` | Defines how data is encoded, especially important for file uploads |

Important idea: a form does not work only because fields exist. The browser needs submission rules, and the server needs field names and values.

## 3. `action`, `method`, and How Data Is Sent

### `action`
The `action` attribute tells the browser where to send the form data.

```html
<form action="/register" method="post">
	<!-- controls go here -->
</form>
```

If `action` is omitted, the browser submits the form to the current page URL.

### `method`
The `method` attribute tells the browser how to send the data.

The two main values are:

- `get`
- `post`

### GET vs POST

| Feature | GET | POST |
|--------|-----|------|
| Where data appears | In the URL query string | In the request body |
| Best for | Search, filters, public queries | Logins, registrations, updates, uploads |
| Can be bookmarked | Yes | Usually no |
| Good for sensitive data | No | Better than GET, but still requires HTTPS |

Example with `get`:

```html
<form action="/search" method="get">
	<label for="query">Search</label>
	<input id="query" name="q" type="text">
	<button type="submit">Search</button>
</form>
```

If the user types `html forms`, the URL may become:

```text
/search?q=html+forms
```

Example with `post`:

```html
<form action="/login" method="post">
	<label for="email">Email</label>
	<input id="email" name="email" type="email">

	<label for="password">Password</label>
	<input id="password" name="password" type="password">

	<button type="submit">Log in</button>
</form>
```

Use `post` when the data changes something on the server or should not appear in the URL.

## 4. The Importance of `name`
The `name` attribute is one of the most important parts of any form control.

The browser sends values using `name=value` pairs. If a control has no `name`, its value is usually not submitted.

Example:

```html
<form action="/profile" method="post">
	<input type="text" id="username" name="username" value="student01">
	<button type="submit">Save</button>
</form>
```

Submitted data:

```text
username=student01
```

This means:

- `id` helps connect labels and scripting,
- `name` identifies the submitted field,
- `value` is the data sent for that field.

Students often confuse `id` and `name`. They are not the same.

## 5. Common Input Types
The `<input>` element supports many types. The `type` attribute changes the behavior, validation, keyboard layout on mobile devices, and browser UI.

### `text`
Used for general single-line text.

```html
<label for="city">City</label>
<input id="city" name="city" type="text">
```

### `password`
Masks typed characters.

```html
<label for="password">Password</label>
<input id="password" name="password" type="password">
```

### `email`
Accepts email addresses and enables browser-level validation.

```html
<label for="student-email">Student email</label>
<input id="student-email" name="email" type="email" required>
```

### `number`
Used for numeric input.

```html
<label for="age">Age</label>
<input id="age" name="age" type="number" min="16" max="99">
```

### `date`
Lets the user select a date.

```html
<label for="start-date">Start date</label>
<input id="start-date" name="startDate" type="date">
```

### `checkbox`
Used when zero, one, or many options can be selected.

```html
<input id="html-topic" name="topics" type="checkbox" value="html">
<label for="html-topic">HTML</label>
```

### `radio`
Used when only one option in a group can be selected.

```html
<input id="beginner" name="level" type="radio" value="beginner">
<label for="beginner">Beginner</label>

<input id="advanced" name="level" type="radio" value="advanced">
<label for="advanced">Advanced</label>
```

Radio buttons belong to the same group when they share the same `name`.

### `file`
Lets the user choose a file from their device.

```html
<label for="cv">Upload CV</label>
<input id="cv" name="cv" type="file">
```

For file upload forms, you usually need:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
	<input type="file" name="document">
	<button type="submit">Upload</button>
</form>
```

### `hidden`
Stores data that is not shown to the user but is still submitted.

```html
<input type="hidden" name="formId" value="contact-v1">
```

Use hidden inputs carefully. They can be changed by users through browser tools, so they are not a security feature.

## 6. Labels and Why They Are Essential
Labels make forms easier to understand and more accessible.

Best practice:

```html
<label for="full-name">Full name</label>
<input id="full-name" name="fullName" type="text">
```

Why labels matter:

- users know what the field is for,
- screen readers can announce the field correctly,
- clicking the label focuses the related input,
- forms become easier to use on desktop and mobile.

### Explicit Label Association
This is the most common and clear pattern.

```html
<label for="email">Email</label>
<input id="email" name="email" type="email">
```

### Wrapped Label Pattern
This also works:

```html
<label>
	Accept terms
	<input name="terms" type="checkbox">
</label>
```

Both are valid, but the explicit `for` plus `id` approach is often easier to maintain.

## 7. `fieldset` and `legend`
Use `<fieldset>` to group related form controls and `<legend>` to describe the group.

This is especially useful for:

- radio button groups,
- sets of checkboxes,
- shipping and billing details,
- profile sections.

Example:

```html
<fieldset>
	<legend>Preferred contact method</legend>

	<input id="contact-email" name="contactMethod" type="radio" value="email">
	<label for="contact-email">Email</label>

	<input id="contact-phone" name="contactMethod" type="radio" value="phone">
	<label for="contact-phone">Phone</label>
</fieldset>
```

Without proper grouping, a screen reader user may hear controls without enough context.

## 8. Placeholder, Required, Disabled, and Readonly

### `placeholder`
Shows a temporary hint inside a field.

```html
<input type="text" name="username" placeholder="Example: student_2026">
```

Important: a placeholder is not a label. It disappears when the user types and should not be the only description of a field.

### `required`
Marks a field as mandatory.

```html
<input type="email" name="email" required>
```

The browser prevents submission if the field is empty.

### `disabled`
Makes a control unavailable and prevents it from being submitted.

```html
<input type="text" name="campus" value="Bucharest" disabled>
```

### `readonly`
Allows a value to be seen and submitted, but not edited.

```html
<input type="text" name="studentId" value="ST-2048" readonly>
```

Difference between `disabled` and `readonly`:

| Attribute | User can focus? | User can edit? | Submitted? |
|-----------|------------------|----------------|------------|
| `disabled` | Usually no | No | No |
| `readonly` | Yes, usually | No | Yes |

## 9. Buttons in Forms
HTML provides three common button types.

### `submit`
Sends the form data.

```html
<button type="submit">Create account</button>
```

### `reset`
Resets fields to their initial values.

```html
<button type="reset">Clear form</button>
```

This can be useful in demos, but in real products it is often avoided because users may click it by mistake.

### `button`
Creates a general-purpose button that does not submit by default.

```html
<button type="button">Check availability</button>
```

If you use JavaScript later, `type="button"` is important when you do not want the form to submit.

## 10. `select`, `option`, and `textarea`

### `select` and `option`
Use these when users need to choose from a predefined list.

```html
<label for="track">Specialization</label>
<select id="track" name="track">
	<option value="">Choose a track</option>
	<option value="frontend">Frontend</option>
	<option value="backend">Backend</option>
	<option value="devops">DevOps</option>
</select>
```

### `textarea`
Use this for multi-line input.

```html
<label for="message">Message</label>
<textarea id="message" name="message" rows="5" cols="30"></textarea>
```

Unlike `<input>`, a `<textarea>` has opening and closing tags.

## 11. Browser Validation with HTML Attributes
HTML includes built-in validation features that reduce the amount of JavaScript needed for simple forms.

### `required`
Ensures the field is not empty.

### `pattern`
Checks the value against a regular expression.

```html
<label for="student-code">Student code</label>
<input
	id="student-code"
	name="studentCode"
	type="text"
	pattern="[A-Z]{2}-[0-9]{4}"
	required
>
```

This pattern accepts values such as `AB-2048`.

### `min` and `max`
Used for numbers and dates.

```html
<label for="experience">Years of experience</label>
<input id="experience" name="experience" type="number" min="0" max="10">
```

### `minlength` and `maxlength`
Useful for text limits.

```html
<input type="text" name="username" minlength="4" maxlength="20">
```

### Validation Example

```html
<form action="/apply" method="post">
	<label for="email">Email</label>
	<input id="email" name="email" type="email" required>

	<label for="portfolio">Portfolio URL</label>
	<input id="portfolio" name="portfolio" type="url">

	<label for="age">Age</label>
	<input id="age" name="age" type="number" min="18" max="65" required>

	<button type="submit">Apply</button>
</form>
```

The browser checks these rules before submission.

## 12. Custom Validation
Sometimes HTML attributes are not enough. In that case, JavaScript can define custom error messages.

Example:

```html
<form id="registration-form">
	<label for="password">Password</label>
	<input id="password" name="password" type="password" required minlength="8">

	<label for="confirm-password">Confirm password</label>
	<input id="confirm-password" name="confirmPassword" type="password" required>

	<button type="submit">Register</button>
</form>

<script>
	const form = document.getElementById("registration-form");
	const password = document.getElementById("password");
	const confirmPassword = document.getElementById("confirm-password");

	form.addEventListener("submit", function (event) {
		if (password.value !== confirmPassword.value) {
			event.preventDefault();
			confirmPassword.setCustomValidity("Passwords must match.");
			confirmPassword.reportValidity();
		} else {
			confirmPassword.setCustomValidity("");
		}
	});
</script>
```

This example checks whether two password fields match.

Important rule: client-side validation improves usability, but server-side validation is still mandatory. Users can bypass client-side checks.

## 13. File Uploads and Encoding
When a form includes a file input, use `enctype="multipart/form-data"`.

```html
<form action="/upload-assignment" method="post" enctype="multipart/form-data">
	<label for="assignment">Upload assignment</label>
	<input id="assignment" name="assignment" type="file" accept=".pdf,.doc,.docx" required>

	<button type="submit">Upload file</button>
</form>
```

Useful related attributes:

- `accept` suggests allowed file types,
- `multiple` allows multiple files,
- `required` makes the upload mandatory.

Example with multiple files:

```html
<input type="file" name="screenshots" multiple accept="image/*">
```

## 14. Accessibility and Best Practices
Good forms are not only valid HTML. They must also be usable.

Best practices:

- Always use labels for form controls.
- Use `fieldset` and `legend` for related groups.
- Keep instructions close to the field.
- Do not rely only on placeholder text.
- Mark required fields clearly.
- Write helpful validation messages.
- Use semantic input types such as `email`, `url`, `tel`, and `date` when appropriate.
- Keep keyboard navigation logical.
- Associate error messages with the relevant field when using JavaScript.

Accessible example:

```html
<form action="/subscribe" method="post">
	<label for="newsletter-email">Email address</label>
	<input
		id="newsletter-email"
		name="email"
		type="email"
		required
		aria-describedby="newsletter-help"
	>
	<p id="newsletter-help">We will only send study updates once a week.</p>

	<button type="submit">Subscribe</button>
</form>
```

## 15. Common Mistakes Beginners Make

### Missing `name`
The input looks correct, but its value is not submitted.

### Using placeholder instead of label
This reduces usability and accessibility.

### Using `get` for sensitive data
Passwords and private information should not go into the URL.

### Forgetting `enctype` on file upload forms
The file may not be transmitted correctly.

### Assuming browser validation is enough
The backend must validate data too.

### Grouping unrelated radio buttons with the same `name`
This forces users to choose only one option across the wrong set.

## 16. Full Example: Student Registration Form
This example combines several concepts from the chapter.

```html
<form action="/students/register" method="post">
	<input type="hidden" name="courseId" value="frontend-101">

	<label for="full-name">Full name</label>
	<input id="full-name" name="fullName" type="text" required>

	<label for="email">Email</label>
	<input id="email" name="email" type="email" required>

	<label for="birth-date">Birth date</label>
	<input id="birth-date" name="birthDate" type="date">

	<fieldset>
		<legend>Study mode</legend>

		<input id="online" name="studyMode" type="radio" value="online" required>
		<label for="online">Online</label>

		<input id="onsite" name="studyMode" type="radio" value="onsite">
		<label for="onsite">On-site</label>
	</fieldset>

	<label for="track">Track</label>
	<select id="track" name="track" required>
		<option value="">Select a track</option>
		<option value="frontend">Frontend</option>
		<option value="fullstack">Full Stack</option>
	</select>

	<label for="motivation">Why do you want to join?</label>
	<textarea id="motivation" name="motivation" rows="5" required></textarea>

	<label>
		<input name="terms" type="checkbox" required>
		I agree to the program rules
	</label>

	<button type="submit">Submit application</button>
</form>
```

What this example demonstrates:

- `form`, `action`, and `method`,
- hidden data,
- text, email, and date inputs,
- radio buttons,
- `select` and `textarea`,
- checkbox agreement,
- required field validation.

## 17. Key Takeaways
- Use `<form>` to collect and submit user input.
- Choose `get` for public queries and `post` for sensitive or state-changing actions.
- Always add meaningful `name` attributes.
- Use labels, fieldsets, and legends for clarity and accessibility.
- Choose the correct input type instead of always using `text`.
- Use HTML validation features first, then add custom validation only when necessary.
- Remember that browser validation helps users, but server validation protects the application.

## Further Reading
- [MDN: HTML forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms)
- [MDN: The form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN: Input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [MDN: Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)
