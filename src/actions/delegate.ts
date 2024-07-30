import {
  SystemProgram,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import endoavsProgramIDL from "../utils/endoavs_program.json";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import BN from "bn.js";
import * as helper from "../utils/helpers";
import {
  DELEGATED_TOKEN_MINT_ID,
  PDA_SEED,
  PROGRAM_ID,
} from "../utils/constants";

export async function delegate(numberOfSOL: number, avsTokenMintAddress: string) {
  anchor.setProvider(anchor.AnchorProvider.env());
  const keypair = anchor.AnchorProvider.env().wallet as anchor.Wallet;
  const endoavsProgram = new anchor.Program(
    endoavsProgramIDL as anchor.Idl,
    PROGRAM_ID
  );
  const avsTokenMintPublicKey = new PublicKey(avsTokenMintAddress);
  const endoavs = PublicKey.findProgramAddressSync(
    [Buffer.from(PDA_SEED), avsTokenMintPublicKey.toBuffer()],
    endoavsProgram.programId
  )[0];

  try {
    await endoavsProgram.methods
      .delegate(new BN(numberOfSOL * LAMPORTS_PER_SOL))
      .accounts({
        staker: keypair.publicKey,
        endoAvs: endoavs,
        avsTokenMint: avsTokenMintPublicKey,
        delegatedTokenVault: getAssociatedTokenAddressSync(
          DELEGATED_TOKEN_MINT_ID,
          endoavs,
          true
        ),
        delegatedTokenMint: DELEGATED_TOKEN_MINT_ID,
        stakerDelegatedTokenAccount: getAssociatedTokenAddressSync(
          DELEGATED_TOKEN_MINT_ID,
          keypair.publicKey,
          true
        ),
        stakerAvsTokenAccount: getAssociatedTokenAddressSync(
          avsTokenMintPublicKey,
          keypair.publicKey,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([keypair.payer])
      .rpc()
      .then(helper.log);
  } catch (error) {
    console.error("Error delegating:", error);
  }
}

export async function undelegate(numberOfSOL: number, avsTokenMintAddress: string) {
  anchor.setProvider(anchor.AnchorProvider.env());
  const keypair = anchor.AnchorProvider.env().wallet as anchor.Wallet;
  const endoavsProgram = new anchor.Program(
    endoavsProgramIDL as anchor.Idl,
    PROGRAM_ID
  );
  const avsTokenMintPublicKey = new PublicKey(avsTokenMintAddress);
  const endoavs = PublicKey.findProgramAddressSync(
    [Buffer.from(PDA_SEED), avsTokenMintPublicKey.toBuffer()],
    endoavsProgram.programId
  )[0];

  try {
    await endoavsProgram.methods
      .undelegate(new BN(numberOfSOL * LAMPORTS_PER_SOL))
      .accounts({
        staker: keypair.publicKey,
        endoAvs: endoavs,
        avsTokenMint: avsTokenMintPublicKey,
        delegatedTokenVault: getAssociatedTokenAddressSync(
          DELEGATED_TOKEN_MINT_ID,
          endoavs,
          true
        ),
        delegatedTokenMint: DELEGATED_TOKEN_MINT_ID,
        stakerDelegatedTokenAccount: getAssociatedTokenAddressSync(
          DELEGATED_TOKEN_MINT_ID,
          keypair.publicKey,
          true
        ),
        stakerAvsTokenAccount: getAssociatedTokenAddressSync(
          avsTokenMintPublicKey,
          keypair.publicKey,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([keypair.payer])
      .rpc()
      .then(helper.log);
  } catch (error) {
    console.error("Error undelegating:", error);
  }
}