import "../styles/ConnectionBar.css";
import { DiscoverWalletProviders } from '../components/DiscoverWalletProviders';
import { useState } from "react";
import Modal from "./Modal";

const ConnectionBar = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <div className="connection-bar">
      <button onClick = {() => setModalOpen(true)} className="connect-btn">🔑 Connect</button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <DiscoverWalletProviders />
      </Modal>
    </div>
  )
}

export default ConnectionBar
