import styled from "styled-components";

const StyledButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.8rem 1.1rem;
	border: 0;
	border-radius: 0.9rem;
	font: inherit;
	font-weight: 700;
	cursor: pointer;
	transition: background-color 180ms ease, transform 180ms ease;
	background: ${({ $tone }) => ($tone === "secondary" ? "#e2e8f0" : "#0f766e")};
	color: ${({ $tone }) => ($tone === "secondary" ? "#0f172a" : "#ffffff")};

	&:hover {
		transform: translateY(-1px);
	}
`;

export function Button({ tone = "primary", children = "Enroll now" }) {
	return <StyledButton $tone={tone}>{children}</StyledButton>;
}
