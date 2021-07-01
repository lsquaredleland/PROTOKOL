import styled from "styled-components";


// TODO: how to hide til user scrolls down?
const FooterStyle = styled.div`
  text-align: center;
  width: 100%;
`

const Link = (content: string, url: string) => (
  <a href={url}>{content}</a>
)

export default function Footer() {

  const Leland = Link("Leland", "https://twitter.com/lsquaredleland");
  const Uni = Link("Uniswap Grants", "https://twitter.com/uniswapgrants")
  
  return (
    <FooterStyle>
      <p>Build by {Leland}, with assistance from {Uni}</p>
    </FooterStyle>
  )
}