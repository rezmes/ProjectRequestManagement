import * as React from "react";
import { IRepeatingBlockProps } from "./IRepeatingBlockProps";

interface IRepeatingBlockState {
  blocks: Array<{ parts: Array<{ rows: any[] }> }>;
}

class RepeatingBlock extends React.Component<
  IRepeatingBlockProps,
  IRepeatingBlockState
> {
  constructor(props: IRepeatingBlockProps) {
    super(props);
    this.state = {
      blocks: [{ parts: [{ rows: [] }, { rows: [] }, { rows: [] }] }],
    };
  }

  addBlock = () => {
    this.setState((prevState) => ({
      blocks: [
        ...prevState.blocks,
        { parts: [{ rows: [] }, { rows: [] }, { rows: [] }] },
      ],
    }));
  };

  addRow = (blockIndex: number, partIndex: number) => {
    const blocks = [...this.state.blocks];
    blocks[blockIndex].parts[partIndex].rows.push({});
    this.setState({ blocks });
  };

  render() {
    return (
      <div>
        <h1>{this.props.description}</h1>
        {this.state.blocks.map((block, blockIndex) => (
          <div key={blockIndex}>
            <h2>Block {blockIndex + 1}</h2>
            {block.parts.map((part, partIndex) => (
              <div key={partIndex}>
                <h3>Part {partIndex + 1}</h3>
                {part.rows.map((row, rowIndex) => (
                  <div key={rowIndex}>Row {rowIndex + 1}</div>
                ))}
                <button onClick={() => this.addRow(blockIndex, partIndex)}>
                  Add Row
                </button>
              </div>
            ))}
          </div>
        ))}
        <button onClick={this.addBlock}>Add Block</button>
      </div>
    );
  }
}

export default RepeatingBlock;
