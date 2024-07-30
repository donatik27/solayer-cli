import { SystemProgram, PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import endoavsProgramIDL from "../utils/endoavs_program.json";
import * as helper from "../utils/helpers";
import { PDA_SEED, PROGRAM_ID } from "../utils/constants";

export async function transferAuthority(newAuthorityAddr: string, avsTokenMintAddress: string) {
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
    // This will fail unless the signer is the authority holder
    const newAuthority = new PublicKey(newAuthorityAddr);
    await endoavsProgram.methods
      .transferAuthority()
      .accounts({
        authority: keypair.publicKey,
        endo_avs: endoavs,
        new_authority: newAuthority,
        avs_token_mint: avsTokenMintPublicKey,
        system_program: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([keypair.payer])
      .rpc()
      .then(helper.log);
  } catch (error) {
    console.error("Error transfering authority:", error);
  }
}