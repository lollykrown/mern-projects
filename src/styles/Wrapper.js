import styled from "styled-components";

const Wrapper = styled.div`
background: ${(props) => props.theme.white};
border: 1px solid ${(props) => props.theme.borderColor};
width: 600px;
padding: 1rem;
justify-self: center;

.suggestion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
}

button {
  font-size: 0.9rem;
  position: relative;
  top: -5px;
}

@media screen and (max-width: 660px) {
  width: 500px;
}

@media screen and (max-width: 530px) {
  width: 450px;
}

@media screen and (max-width: 480px) {
  width: 380px;
}

@media screen and (max-width: 400px) {
  width: 340px;

  button {
    font-size: 0.8rem;
  }
}
`;

export default Wrapper;
