// import React, { useEffect, useState } from 'react'
// import styled from 'styled-components'
// import { useProposalData, useActiveProtocol, useProposalStatus, useUserVotes } from '../../contexts/governance/hooks'
// import ReactMarkdown from 'react-markdown'
// import { TYPE, ExternalLink } from '../../theme'
// import { DateTime } from 'luxon'
// import { AVERAGE_BLOCK_TIME_IN_SECS, BIG_INT_ZERO } from '../../constants'
// import { isAddress, getEtherscanLink } from '../../utils'
// import { useActiveWeb3React } from '../../hooks'
import { RouteComponentProps, withRouter } from 'react-router-dom'
// import { SUPPORTED_PROTOCOLS } from '../../state/governance/reducer'
// import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
// import { useBlockNumber, useModalOpen, useToggleModal } from '../../state/application/hooks'
// import { BigNumber } from 'ethers'
// import { nameOrAddress } from '../../utils/getName'
// import { useAllIdentities } from '../../state/social/hooks'
// import { ButtonError } from '../../components/Button'

// const Wrapper = styled.div<{ backgroundColor?: string }>``


function ProposalDetails({
  match: {
    params: { protocolID, proposalID }
  },
  history
}: RouteComponentProps<{ protocolID: string; proposalID: string }>) {
  // const { chainId } = useActiveWeb3React()

  console.log("Proposal Detals", protocolID, proposalID, history)

  // // if valid protocol id passed in, update global active protocol
  // const dispatch = useDispatch<AppDispatch>()
  // const [, setActiveProtocol] = useActiveProtocol()
  // useEffect(() => {
  //   if (protocolID && Object.keys(SUPPORTED_PROTOCOLS).includes(protocolID)) {
  //     setActiveProtocol(SUPPORTED_PROTOCOLS[protocolID])
  //   }
  // }, [dispatch, protocolID, setActiveProtocol])

  // const proposalData = useProposalData(proposalID)
  // const status = useProposalStatus(proposalID) // @TODO shoudlnt use spearate data for this

  // // get and format data
  // const currentTimestamp = useCurrentBlockTimestamp()
  // const currentBlock = useBlockNumber()
  // const endDate: DateTime | undefined =
  //   proposalData && currentTimestamp && currentBlock
  //     ? DateTime.fromSeconds(
  //         currentTimestamp
  //           .add(BigNumber.from(AVERAGE_BLOCK_TIME_IN_SECS).mul(BigNumber.from(proposalData.endBlock - currentBlock)))
  //           .toNumber()
  //       )
  //     : undefined
  // const now: DateTime = DateTime.local()

  // // get total votes and format percentages for UI
  // const totalVotes: number | undefined =
  //   proposalData?.forCount !== undefined && proposalData?.againstCount !== undefined
  //     ? proposalData.forCount + proposalData.againstCount
  //     : undefined

  // const forPercentage: string =
  //   proposalData?.forCount !== undefined && totalVotes
  //     ? ((proposalData.forCount * 100) / totalVotes).toFixed(0) + '%'
  //     : '0%'

  // const againstPercentage: string =
  //   proposalData?.againstCount !== undefined && totalVotes
  //     ? ((proposalData.againstCount * 100) / totalVotes).toFixed(0) + '%'
  //     : '0%'

  // const [allIdentities] = useAllIdentities()

  // // show links in propsoal details if content is an address
  // const linkIfAddress = (content: string) => {
  //   if (isAddress(content) && chainId) {
  //     return (
  //       <ExternalLink href={getEtherscanLink(chainId, content, 'address')}>
  //         {nameOrAddress(content, allIdentities)}
  //       </ExternalLink>
  //     )
  //   }
  //   return <span>{nameOrAddress(content, allIdentities)}</span>
  // }

  // const userAvailableVotes = useUserVotes()

  return (
    <>
      <div>Proposal Details Page</div>
    </>
  )
}

export default withRouter(ProposalDetails)